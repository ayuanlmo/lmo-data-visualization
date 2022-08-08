/**
 * This JavaScript(ECMAScript 6) library is used for network data requests
 * @author ayuanlmo
 * @module axios
 * @module @/store
 * Created by ayuanlmo on 2022/02
 * **/
import {Notification} from "element-ui";

const axios = require('axios');

axios.interceptors.response.use(r => {
    if (r.data.code !== 200)
        Notification({
            title: '提示',
            message: `${r.data.message}`,
            type: 'error'
        });
    return r.data;
});

axios.interceptors.request.use(conf => {
    return conf;
});

export const _POST = (url, params) => {
    return axios.post(require('@/config/AppConfig').devProxy.http + url, params);
};

export const _POST_Form_Data = (url, params = {}) => {
    return axios.post(require('@/config/AppConfig').devProxy.http + url, require('@/utils/index').getFormData(params), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    });
};