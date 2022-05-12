const AppConfig = require('./src/config/AppConfig');
const CompressionPlugin = require('compression-webpack-plugin');
const GzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const TimeStamp = new Date().getTime();

const resolve = (dir) => {
    return require('path').join(__dirname, dir);
};

require('./src/lib/CliColor/index.t');
module.exports = {
    outputDir: AppConfig.build.outputDir,
    assetsDir: AppConfig.build.assetsDir,
    filenameHashing: true,
    publicPath: AppConfig.publicPath,
    indexPath: AppConfig.build.indexPath,
    runtimeCompiler: false,
    productionSourceMap: false,
    css: {
        sourceMap: false,
        extract: {
            filename: `css/lmo-css_[name].${TimeStamp}.t.css`,
            chunkFilename: `css/lmo-css_[name].${TimeStamp}.t.css`
        },
        loaderOptions: {}
    },
    configureWebpack: {
        name: AppConfig.appName,
        output: {
            filename: `js/lmo-js_[name].${TimeStamp}.t.js`,
            chunkFilename: `js/lmo-js_[name].${TimeStamp}.t.js`
        },
        plugins: [
            // new MiniCssExtractPlugin({
            //     filename: `css/lmo-css_[name].${timeStamp}.ayt.css`,
            //     chunkFilename: `css/lmo-css_[name].${timeStamp}.ayt.css`
            // })
        ]
    },
    chainWebpack: conf => {
        if (!AppConfig.dev)
            if (AppConfig.build.gzip)
                //gzip
                conf.plugin('compressionPlugin').use(new CompressionPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: GzipExtensions,
                    threshold: 2028,
                    minRatio: 0.5,
                    deleteOriginalAssets: false
                }));
        conf.plugin('html').tap(apps => {
            apps[0].title = AppConfig.title;
            return apps;
        });
        conf.resolve.alias.set('@src', resolve('src'));
        conf.resolve.alias.set('@static', resolve('src/assets'));
        conf.resolve.alias.set('@components', resolve('src/components'));
        conf.resolve.alias.set('@config', resolve('src/config'));
        conf.resolve.alias.set('@const', resolve('src/const'));
        conf.resolve.alias.set('@lib', resolve('src/lib'));
        conf.resolve.alias.set('@style', resolve('src/style'));
        conf.resolve.alias.set('@views', resolve('src/views'));
        conf.resolve.alias.set('@utils', resolve('src/utils'));
    }
};