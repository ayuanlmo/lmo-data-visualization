import appConfig, {DevProxyOptions} from './AppConfig.ts';

const DevProxyConf: DevProxyOptions = appConfig.devProxy;

interface ProxyConfig {
    target: string;
    ws: boolean;
    pathRewrite: {
        [key: string]: string;
    };
}

const config: { [key: string]: ProxyConfig } = {
    '/connectSocket': {
        target: `${DevProxyConf.defaultAddress}${DevProxyConf.wsPath}`,
        ws: true,
        pathRewrite: {
            '^/connectSocket': ''
        }
    },
    '/server': {
        target: `${DevProxyConf.defaultAddress}`,
        ws: false,
        pathRewrite: {
            '^/server': ''
        }
    }
};

export default config;
