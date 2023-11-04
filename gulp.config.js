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
            tmp: '.tmp/',
            src: "./src",
            srcPages: "./src/pages",
            srcFonts: "./src/fonts",
            srcImages: "./src/images",
            srcStyles: "./src/styles",
            srcScripts: "./src/scripts",
            srcPlugins: "./src/plugins",
            node_modules: "./node_modules",
        },
        dist: "./dist/assets",
        distPages: "./dist/pages",
    },
};


export {
    gulpConfig
};
