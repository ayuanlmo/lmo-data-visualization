import {Loading} from "element-ui";

let L = null;

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
