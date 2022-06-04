module.exports = {
    appName: 'lmo-Data-Visualization',
    appAuthor: 'ayuanlmo',
    title: 'lmo-Data-Visualization',
    dev: process.env.NODE_ENV === 'development',
    publicPath: '/',
    build: {
        outputDir: 'dist',
        assetsDir: 'static',
        indexPath: 'index.html',
        gzip: true,
        productionSourceMap: false,
        cssSourceMap: false
    },
    devProxy: {
        defaultAddress: 'http://localhost:3000/',
        ws: '/connectSocket',
        wsPath: 'ws/connect',
        http: '/server'
    },
    router: {
        keep: true,
        mode: 'history',
        base: '/'
    },
    storageOptions: {
        namespace: '_lmo_',
        storage: 'local'
    },
    specialThanks: ['糖兮兮', '游游', 'YC SEMI', 'Yc Core'],
    openSource: {
        github: 'https://github.com/ayuanlmo/lmo-data-visualization',
        gitee: 'https://gitee.com/ayuanlmo/lmo-data-visualization'
    }
};