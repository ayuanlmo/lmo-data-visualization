/**
 * BasicInteraction
 * @module element-ui
 * @description 基本交互
 * **/

import {Loading, Message, MessageBox, Notification} from "element-ui";

//Loading service
let L = null;

/**
 * @method createMessage
 * @param conf {object}
 * @description 创建消息
 * **/
export const createMessage = (conf = {}) => {
    Message.closeAll();
    return new Promise(resolve => {
        Message(conf);
    });
};

/**
 * @method createMessageBox
 * @param conf {object}
 * @description 创建消息框
 * **/
export const createMessageBox = (conf = {}) => {
    return new Promise(resolve => {
        MessageBox(conf).then(e => resolve(resolve)).catch(() => {
        });
    });
};

/**
 * @method createNotification
 * @param conf {object}
 * @description 创建通知
 * **/
export const createNotification = (conf = {}) => {
    return Notification(conf);
};


export const createLoading = (data) => {
    closeLoading();
    L = Loading.service({
        ...{
            lock: true,
            text: data ?? '加载中,请稍后...',
            spinner: 'el-icon-loading',
            background: '#162431'
        }
    });
};

/**
 * @method closeLoading
 * @description 关闭加载服务
 * **/
export const closeLoading = () => {
    L && L.close();
    L = null;
};
