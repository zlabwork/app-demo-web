## App-Demo-Web
不推荐全局安装 webpack。这会将你项目中的 webpack 锁定到指定版本，并且在使用不同的 webpack 版本的项目中，可能会导致构建失败。


## Npm
```shell
# create package.json
npm init

# install
npm install

# build
npm run build

# watch
npm run watch
```


## ESLint & babel
```shell
npm install --save-dev eslint
npm init @eslint/config
npm install --save-dev @babel/core @babel/preset-env
```


## Webpack
```shell
# webpack
npm install --save-dev webpack webpack-cli
npm install --save-dev style-loader css-loader file-loader
npm install --save-dev sass-loader sass
npm install --save-dev html-webpack-plugin
npm install --save-dev clean-webpack-plugin
npm install --save-dev webpack-dev-server
npm install --save-dev webpack-merge
npm install --save-dev mini-css-extract-plugin css-minimizer-webpack-plugin

# lodash
npm install --save lodash

# pack
npx webpack
```


## Gulp
```shell
# gulp-cli
npm install --save-dev gulp-cli

# cd my-project
npm init
npm install --save-dev gulp
npm install --save-dev gulp-babel @babel/core
```

## Docs
https://eslint.org/demo  
https://webpack.js.org  
https://webpack.docschina.org/guides  
https://gulpjs.com  
