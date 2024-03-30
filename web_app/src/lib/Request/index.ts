import axios from 'axios';
import Nprogress from "../Nprogress";
import Notification from "../Notification";


axios.defaults.baseURL = '/api/api';

axios.interceptors.request.use(conf => {
    Nprogress.start();
    return conf;
});
axios.interceptors.response.use(
    function (response) {
        const {status, data} = response;

        setTimeout((): void => {
            Nprogress.done();
        }, 100);

        if (status === 204) {
            return Promise.resolve({});
        } else if (status === 504) {
            Notification.openNotification('系统通知', '服务器错误', 'error');
            return Promise.resolve({});
        } else if (data && data.code === 200) {
            return Promise.resolve(data);
        }
        if ('data' in response && '_app' in response) {
            return Promise.resolve(response);
        }
        Notification.openNotification('系统通知', '服务器异常', 'error');
        return Promise.reject(response);


    },
    function (error) {
        return Promise.reject(error);
    }
);

namespace Request {
    export const getTemplate = (params: object = {}) => {
        return axios({
            url: '/template',
            method: 'get',
            params: params,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const editTemplate = (data: object = {}) => {
        return axios({
            url: '/template',
            method: 'put',
            data: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const copyTemplate = (data: object = {}) => {
        return axios({
            url: '/template/copy',
            method: 'post',
            data: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const getColors = (data: object = {}) => {
        return axios({
            url: '/color',
            method: 'get',
            params: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const getFileList = (data: object = {}) => {
        return axios({
            url: '/uploadFile',
            method: 'get',
            params: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const uploadFile = (data: object = {}) => {
        return axios({
            url: '/uploadFile',
            method: 'post',
            data: data,
            headers: {'Content-Type': 'multipart/form-data'}
        });
    };
}

export default Request;
