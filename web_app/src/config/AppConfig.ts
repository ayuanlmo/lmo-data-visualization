export interface BuildOptions {
    outputDir: string; // 打包资源输出目录
    assetsDir: string; // 静态文件输出目录(基于outputDir)
    indexPath: string; // 索引
    gzip: boolean; // 开启gzip(如果您的server不支持gzip，也唔使担心)
    productionSourceMap: boolean; // map
    cssSourceMap: boolean; // map
}

export interface DevProxyOptions {
    defaultAddress: string; // 默认代理地址
    ws: string; // 应用socket地址
    wsPath: string; // 服务器socket地址
    http: string; // 应用服务器地址
}

export interface RouterOptions {
    keep: boolean; // 路由缓存(非keep-alive)
    mode: string; // 路由模式
    base: string;
}

export interface StorageOptions {
    namespace: string;
    storage: string;
}

export interface PagesOptions {
    welcome: boolean; // 隐藏welcome页面
}

export interface AppConfig {
    appName: string; // 应用名称
    appAuthor: string; // 作者
    title: string; // 应用标题
    dev: boolean; // 开发模式
    publicPath: string; // 应用公共路径
    build: BuildOptions;
    devProxy: DevProxyOptions;
    router: RouterOptions;
    storageOptions: StorageOptions;
    pages: PagesOptions;
    specialThanks: string[];
    openSource: {
        github: string;
    };
}

const appConfig: AppConfig = {
    appName: 'lmo-Data-Visualization',
    appAuthor: 'ayuanlmo',
    title: 'lmo-Data-Visualization',
    dev: process.env.NODE_ENV === 'development',
    publicPath: '/',
    build: {
        outputDir: '../server/dist/web',
        assetsDir: 'static',
        indexPath: 'index.html',
        gzip: true,
        productionSourceMap: false,
        cssSourceMap: false,
    },
    devProxy: {
        defaultAddress: 'http://localhost:3000/',
        ws: '/connectSocket',
        wsPath: '/ws/connect',
        http: process.env.NODE_ENV === 'development' ? '/server' : '',
    },
    router: {
        keep: true,
        mode: 'history',
        base: '/',
    },
    storageOptions: {
        namespace: '_lmo_',
        storage: 'local',
    },
    pages: {
        welcome: true,
    },
    specialThanks: ['糖兮兮', '游游', 'YC SEMI', 'Yc Core'],
    openSource: {
        github: 'https://github.com/ayuanlmo/lmo-data-visualization',
    },
};

export default appConfig;
