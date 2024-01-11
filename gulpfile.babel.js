import del from "del";
import {gulpConfig} from "./gulp.config.js"

const {src, dest, watch, series, parallel, lastRun} = require('gulp');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin'); // 压缩html
const useref = require('gulp-useref');
const plumber = require('gulp-plumber');
const rename = require("gulp-rename"); // 重命名
const gulpif = require('gulp-if'); // 判断
const sass = require('gulp-sass')(require('sass')); // 解析sass
const cssnano = require('cssnano'); // 压缩css
const concat = require('gulp-concat'); // 合并文件
const uglify = require('gulp-uglify'); // 压缩js
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const browserify = require('browserify');
var tap = require('gulp-tap');
const {argv} = require('yargs');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
// 以下两个一起使用，自动处理浏览器兼容问题
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// Env
const port = argv.port || 3000;
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;

// pages
function pages() {
    return src(gulpConfig.config.path.srcPages + '/**/*.html')
        .pipe(useref({searchPath: [gulpConfig.config.path.tmp, '.']}))
        //.pipe(gulpif(/\.js$/, uglify({compress: {drop_console: true}})))
        //.pipe(gulpif(/\.css$/, postcss([cssnano({safe: true, autoprefixer: false})])))
        .pipe(gulpif(gulpConfig.config.compile.htmlMinify, htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: {compress: {drop_console: true}},
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        })))
        .pipe(dest(gulpConfig.config.path.distPages));
}

// images
function images() {
    return src(gulpConfig.config.path.srcImages + '/**/*', {since: lastRun(images)})
        // .pipe($.imagemin())
        .pipe(dest(gulpConfig.config.path.dist + '/images'));
}

// fonts
function fonts() {
    return src(gulpConfig.config.path.srcFonts + '**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(dest(gulpConfig.config.path.dist + '/fonts'));
}

// ES6
function scriptES6() {
    var b = browserify({
        transform: ['babelify'],
        entries: gulpConfig.config.path.srcScripts + "app.js",
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(babel())
        .pipe(dest(gulpConfig.config.path.dist + '/js'))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(gulpConfig.config.path.dist + '/js'));
}

// 编译
function script() {
    return src(gulpConfig.config.path.srcScripts + '**/*.js', {sourcemaps: true})
        .pipe(tap(function (file) {
            console.log('bundling ' + file.path)
            file.contents = browserify(file.path, {debug: true})
                .transform("babelify", {presets: ["@babel/preset-env"]})
                .bundle();
        }))
        .pipe(buffer())
        .pipe(concat("app.js"))
        .pipe(dest(gulpConfig.config.path.tmp + 'scripts', {sourcemaps: true}))
}

// 编译css
function styles() {
    return src(gulpConfig.config.path.srcStyles + '**/*.{scss,sass}')
        .pipe(plumber())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(postcss([
            tailwindcss(),
            autoprefixer()
        ]))
        .pipe(concat("app.css"))
        //.pipe(postcss([cssnano({safe: true, autoprefixer: false})]))
        .pipe(dest(gulpConfig.config.path.tmp + 'styles'))
}

// 插件
async function vendor() {

    // vendor.min.js
    src(gulpConfig.config.vendor)
        .pipe(plumber())
        .pipe(concat("vendor.js"))
        .pipe(rename({suffix: ".min"}))
        .pipe(dest(gulpConfig.config.path.dist + '/js'))

    // libs
    for (var item of gulpConfig.config.libs) {
        await src(item.assets).pipe(dest(gulpConfig.config.path.dist + "/libs/" + item.name));
    }
}

// 压缩
function compress() {
    src(gulpConfig.config.path.tmp + 'styles/*.css')
        .pipe(plumber())
        .pipe(gulpif(/\.css$/ && gulpConfig.config.compile.cssMinify, postcss([cssnano({safe: true, autoprefixer: false})])))
        .pipe(rename({suffix: ".min"}))
        .pipe(dest(gulpConfig.config.path.dist + '/css'))

    return src(gulpConfig.config.path.tmp + 'scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(gulpif(/\.js$/ && gulpConfig.config.compile.jsMinify, uglify({compress: {drop_console: false}})))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(gulpConfig.config.path.dist + '/js'))
}

// 清理
function clean() {
    return del([gulpConfig.config.path.dist, gulpConfig.config.path.distPages, gulpConfig.config.path.tmp])
}

// dev server
function startAppServer() {
    browserSync.init({
        notify: true,
        port: port,
        // proxy: "127.0.0.1:8080"
        server: {
            baseDir: [gulpConfig.config.path.tmp, gulpConfig.config.path.dist, gulpConfig.config.path.srcPages],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });

    watch([
        // gulpConfig.config.path.srcPages + '**/*.html',
        gulpConfig.config.path.srcImages + '**/*',
        gulpConfig.config.path.srcFonts + '**/*'
    ]).on('change', browserSync.reload);
    watch(gulpConfig.config.path.srcPages + '**/*.html', styles).on('change', browserSync.reload);
    watch(gulpConfig.config.path.srcStyles + '**/*.{scss,sass}', styles).on('change', browserSync.reload);
    watch(gulpConfig.config.path.srcScripts + '**/*.js', script).on('change', browserSync.reload);
}

// 构建
const build = series(
    clean,
    parallel(
        series(parallel(styles, script, vendor), compress),
        pages,
        images,
        fonts,
    ),
);

// 开发服务器
const develop = series(
    clean,
    parallel(
        series(parallel(styles, script, vendor)),
        images,
        fonts,
    ),
    startAppServer
);

exports.script = script;
exports.style = styles;
exports.build = build;
exports.start = develop;
exports.clean = clean;
exports.default = develop;
