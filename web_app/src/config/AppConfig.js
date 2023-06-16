module.exports = {
    appName: 'lmo-Data-Visualization',//应用名称
    appAuthor: 'ayuanlmo',//作者
    title: 'lmo-Data-Visualization',//应用标题
    dev: process.env.NODE_ENV === 'development',//开发模式
    publicPath: '/',//应用公共路径
    build: {
        outputDir: '../server/dist/web',//打包资源输出目录
        assetsDir: 'static',//静态文件输出目录(基于outputDir)
        indexPath: 'index.html',//索引
        gzip: true,//开启gzip(如果您的server不支持gzip，也唔使担心)
        productionSourceMap: false,//map
        cssSourceMap: false//map
    },
    devProxy: {
        defaultAddress: 'http://localhost:3000/',//默认代理地址
        ws: '/connectSocket',//应用socket地址
        wsPath: '/ws/connect',//服务器socket地址
        http: process.env.NODE_ENV === 'development' ? '/server' :''//应用服务器地址
    },
    router: {
        keep: true,//路由缓存(非keep-alive)
        mode: 'history',//路由模式
        base: '/'
    },
    storageOptions: {
        namespace: '_lmo_',
        storage: 'local'
    },
    pages: {
        welcome: true//隐藏welcome页面
    },
    specialThanks: ['糖兮兮', '游游', 'YC SEMI', 'Yc Core'],
    openSource: {
        github: 'https://github.com/ayuanlmo/lmo-data-visualization'
    }
};
