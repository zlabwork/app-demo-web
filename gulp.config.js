const gulpConfig = {
    name: 'Gulp Config',
    desc: "Gulp build config",
    version: "1.0.0",
    config: {
        debug: false,
        compile: {
            htmlMinify: false,
            jsMinify: true,
            cssMinify: true,
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
            dist: "./dist/assets",
            distPages: "./dist/pages",
        },
        vendor: [
            "./node_modules/jquery/dist/jquery.min.js",
            "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
        ],
        libs: [
            // {
            //     "name": "summernote",
            //     "assets": [
            //         "./node_modules/summernote/dist/lang/summernote-zh-CN.min.js",
            //         "./node_modules/summernote/dist/summernote-bs5.min.js",
            //         "./node_modules/summernote/dist/summernote-bs5.css"
            //     ]
            // },
        ]
    },
};


export {
    gulpConfig
};
