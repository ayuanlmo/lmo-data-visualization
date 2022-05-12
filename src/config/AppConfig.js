module.exports = {
    appName: 'lmo-Data-Visualization',
    appAuthor: 'ayuanlmo',
    title: 'lmo-Data-Visualization',
    dev: process.env.NODE_ENV === 'development',
    publicPath: '/lmo-data-visualization',
    build: {
        outputDir: 'dist',
        assetsDir: 'static',
        indexPath: 'index.html',
        gzip: true
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
    openSource: {
        github: 'https://ayuanlmo.cn',
        gitee: 'https://ayuanlmo.cn'
    }
};