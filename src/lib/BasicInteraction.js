import {Loading, Message, MessageBox, Notification} from "element-ui";

let L = null;

export const createMessage = (conf = {}) => {
    Message.closeAll();
    return new Promise(resolve => {
        Message(conf);
    });
};

export const createMessageBox = (conf = {}) => {
    return new Promise(resolve => {
        MessageBox(conf).then(e => resolve(resolve)).catch(() => {
        });
    });
};

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

export const closeLoading = () => {
    L && L.close();
    L = null;
};
