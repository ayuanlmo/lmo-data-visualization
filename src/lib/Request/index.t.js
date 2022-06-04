/**
 * This JavaScript(ECMAScript 6) library is used for network data requests
 * @author ayuanlmo
 * @module axios
 * @module @/store
 * Created by ayuanlmo on 2022/02
 * **/

const axios = require('axios');

import {Notification} from "element-ui";

axios.interceptors.response.use(r => {
    if (r.data.code !== 200)
        Notification({
            title: '提示',
            message: `[${r.config.method}] ${r.config.url}请求失败`,
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