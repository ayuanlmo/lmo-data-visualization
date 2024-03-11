import axios from 'axios';
import Nprogress from "../Nprogress";
import Notification from "../Notification";


axios.defaults.baseURL = '/api/api';

axios.interceptors.request.use(conf => {
    Nprogress.start();
    return conf;
});
axios.interceptors.response.use(conf => {
    const data = conf.data;
    setTimeout((): void => {
        Nprogress.done();
    }, 100);
    if (data.status === 204) {
        Notification.openNotification('通知', '成功', 'success');
        return conf.data;
    }
    if (data.status === 504) {
        Notification.openNotification('通知', '服务器错误', 'error');
        return {};
    }

    if (data.code !== 200) {
        Notification.openNotification(conf.data.code as string, data.message, 'error');
        return conf.data;
    }
    return conf.data;
});

namespace Request {
    export const getTemplate = (params: object = {}) => {
        return axios({
            url: '/template',
            method: 'get',
            params: params,
            headers: {'Content-Type': 'application/json'}
        })
    }
}

export default Request;
