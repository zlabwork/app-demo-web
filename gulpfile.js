const path = {
    tmp: '.tmp/',
    src: 'src/',
    src_page: 'src/pages/',
    src_style: 'src/styles/',
    src_script: 'src/scripts/',
    src_font: 'src/fonts/',
    src_image: 'src/images/',
    dist: 'dist/',
    dist_assets: 'dist/assets/',
    dist_page: 'dist/pages/',
}

const {src, dest, watch, series, parallel, lastRun} = require('gulp');
const del = require('del');
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
const {argv} = require('yargs');
// 以下两个一起使用，自动处理浏览器兼容问题
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
// unused
// const source = require('vinyl-source-stream');
// const buffer = require('vinyl-buffer');

// Env
const port = argv.port || 3000;
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;

// pages
function pages() {
    return src(path.src_page + '**/*.html')
        .pipe(useref({searchPath: [path.tmp, '.']}))
        //.pipe(gulpif(/\.js$/, uglify({compress: {drop_console: true}})))
        //.pipe(gulpif(/\.css$/, postcss([cssnano({safe: true, autoprefixer: false})])))
        .pipe(gulpif(/\.html$/, htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: {compress: {drop_console: true}},
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        })))
        .pipe(dest(path.dist_page));
}

// images
function images() {
    return src(path.src_image + '**/*', {since: lastRun(images)})
        // .pipe($.imagemin())
        .pipe(dest(path.dist_assets + 'images'));
}

// fonts
function fonts() {
    return src(path.src_font + '**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(dest(path.dist_assets + 'fonts'));
}

// ES6
function scriptES6() {
    var b = browserify({
        transform: ['babelify'],
        entries: path.src_script + "app.js",
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(babel())
        .pipe(dest(path.dist_assets + 'js'))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.dist_assets + 'js'));
}

// 编译
function script() {
    return src(path.src_script + '**/*.js', {sourcemaps: true})
        .pipe(plumber())
        .pipe(babel())
        .pipe(concat("app.js"))
        .pipe(dest(path.tmp + 'scripts', {sourcemaps: true}))
}

// 编译css
function styles() {
    return src(path.src_style + '**/*.{scss,sass}')
        .pipe(plumber())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(concat("app.css"))
        //.pipe(postcss([cssnano({safe: true, autoprefixer: false})]))
        .pipe(dest(path.tmp + 'styles'))
}

// 插件
async function vendor() {

    // vendor.min.js
    src([
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    ])
        .pipe(plumber())
        .pipe(concat("vendor.js"))
        .pipe(rename({suffix: ".min"}))
        .pipe(dest(path.dist_assets + 'js'))

    // libs
    let assetsList = {
        libs: [
            /*{
                "name": "summernote",
                "assets": [
                    "./node_modules/summernote/dist/lang/summernote-zh-CN.min.js",
                    "./node_modules/summernote/dist/summernote-bs5.min.js",
                    "./node_modules/summernote/dist/summernote-bs5.css"
                ]
            },*/
        ]
    };

    for (var item of assetsList.libs) {
        await src(item.assets).pipe(dest(path.dist_assets + "libs/" + item.name));
    }
}

// 压缩
function compress() {
    src(path.tmp + 'styles/*.css')
        .pipe(plumber())
        .pipe(gulpif(/\.css$/, postcss([cssnano({safe: true, autoprefixer: false})])))
        .pipe(rename({suffix: ".min"}))
        .pipe(dest(path.dist_assets + 'css'))

    return src(path.tmp + 'scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(gulpif(/\.js$/, uglify({compress: {drop_console: true}})))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.dist_assets + 'js'))
}

// 清理
function clean() {
    return del([path.dist, path.dist_assets, path.tmp])
}

// dev server
function startAppServer() {
    browserSync.init({
        notify: true,
        port: port,
        // proxy: "127.0.0.1:8080"
        server: {
            baseDir: [path.tmp, path.dist, path.src_page],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });

    watch([
        path.src_page + '**/*.html',
        path.src_image + '**/*',
        path.src_font + '**/*'
    ]).on('change', browserSync.reload);
    watch(path.src_style + '**/*.{scss,sass}', styles).on('change', browserSync.reload);
    watch(path.src_script + '**/*.js', script).on('change', browserSync.reload);
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
exports.default = develop;
