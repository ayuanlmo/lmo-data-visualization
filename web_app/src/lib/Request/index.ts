import axios from 'axios';
import Nprogress from "../Nprogress";
import Notification from "../Notification";
import i18n from "../../i18n";

axios.defaults.baseURL = '/api/api';

axios.interceptors.request.use(conf => {
    Nprogress.start();
    return conf;
});
axios.interceptors.response.use((response): Promise<any> => {
        const {status} = response;

        setTimeout((): void => {
            Nprogress.done();
        }, 100);

        if (status === 204) {
            return Promise.resolve();
        }

        if ('data' in response) {
            if (response?.data?.errorCode === 'ext00el') {
                Notification.openNotification(i18n.t('sysNotify'), i18n.t('liveServerNotSupported'), 'error');
                return Promise.reject();
            }
            if (response.data.code === 500) {
                Notification.openNotification(i18n.t('sysNotify'), i18n.t('serverError'), 'error');
                return Promise.reject({});
            }
            if (response.data.code === 200)
                return Promise.resolve(response.data);
        }
        if (status === 504) {
            Notification.openNotification(i18n.t('sysNotify'), i18n.t('netError'), 'error');
            return Promise.reject({});
        }
        return Promise.reject(response);
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

    export const deleteTemplate = (id: string = '') => {
        return axios({
            url: `/template/${id}`,
            method: 'delete',
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

    export const getFileCategory = (data: object = {}) => {
        return axios({
            url: '/uploadFileCategory',
            method: 'get',
            params: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const addFileCategory = (data: object = {}) => {
        return axios({
            url: '/uploadFileCategory',
            method: 'post',
            data: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const deleteFileCategory = (id: string) => {
        return axios({
            url: `/uploadFileCategory/${id}`,
            method: 'delete',
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

    export const editFileInfo = (id: string, data: object = {}) => {
        return axios({
            url: `/editFileInfo/${id}`,
            method: 'put',
            data: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const deleteFile = (data: object = {}) => {
        return axios({
            url: '/deleteFile',
            method: 'delete',
            data: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const createTask = (data: object = {}) => {
        return axios({
            url: '/createTask',
            method: 'post',
            data: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const createCustomTemplate = (data: object = {}) => {
        return axios({
            url: '/createCustomTemplate',
            method: 'post',
            data: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const resourcesList = (data: object = {}) => {
        return axios({
            url: '/resources',
            method: 'get',
            params: data,
            headers: {'Content-Type': 'application/json'}
        });
    };

    export const deleteResources = (id: string) => {
        return axios({
            url: `/resources/${id}`,
            method: 'delete',
            headers: {'Content-Type': 'application/json'}
        });
    };
}

export default Request;
