const gulpConfig = {
    name: 'Gulp Config',
    desc: "Gulp build config",
    version: "1.0.0",
    config: {
        debug: false,
        compile: {
            jsMinify: false,
            cssMinify: false,
            jsSourcemaps: false,
            cssSourcemaps: false,
        },
        path: {
            src: "./src",
            srcPages: "./src/pages",
            srcFonts: "./src/fonts",
            srcImages: "./src/images",
            srcStyles: "./src/styles",
            srcScripts: "./src/scripts",
            srcPlugins: "./src/plugins",
            node_modules: "./node_modules",
        },
        dist: ["./dist/assets"],
    },
};

const pathConfig = {
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

export {
    gulpConfig,
    pathConfig
};
