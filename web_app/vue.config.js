require('./src/lib/CliColor/index.t');

const AppConfig = require('./src/config/AppConfig');
const CompressionPlugin = require('compression-webpack-plugin');
const GzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const TimeStamp = new Date().getTime();
const resolve = (dir) => {
    return require('path').join(__dirname, dir);
};

module.exports = {
    outputDir: AppConfig.build.outputDir,
    assetsDir: AppConfig.build.assetsDir,
    publicPath: AppConfig.publicPath,
    indexPath: AppConfig.build.indexPath,
    productionSourceMap: AppConfig.build.productionSourceMap,
    filenameHashing: true,
    runtimeCompiler: false,
    css: {
        sourceMap: AppConfig.build.cssSourceMap,
        extract: {
            filename: `css/lmo-css_[contenthash].t.css`,
            chunkFilename: `css/lmo-css_chunk_[chunkhash].t.css`
        },
        loaderOptions: {}
    },
    configureWebpack: {
        name: AppConfig.appName,
        output: {
            filename: `js/lmo-js_[hash].t.js`,
            chunkFilename: `js/lmo-js_chunk_[contenthash].t.js`
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
            apps[0].buildTime = require('./src/utils/index').formatDate(TimeStamp);
            apps[0].osType = require('os').type();
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
    },
    devServer: {
        proxy: {
            ...require('./src/config/DevProxy')
        }
    }
};