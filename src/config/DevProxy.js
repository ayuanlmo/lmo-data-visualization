const DevProxyConf = require('./AppConfig').devProxy;

module.exports = {
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