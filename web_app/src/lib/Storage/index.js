/**
 * Storage Javascript(ECMAScript 6) Library
 * @author ayuanlmo
 * @module core
 * Created by ayuanlmo on 2022/02
 * **/

// import lmoStorage from "lmo-storage";
//const storage = AppConfig.storageOptions.storage === 'local' ? localStorage : sessionStorage;
import ls from "./core.t";

const lmoStorage = new ls(require('@/config/AppConfig').storageOptions.storage);
const namespace = require('@/config/AppConfig').storageOptions.namespace;

export const set = (key, value) => {
    return lmoStorage.set(`${namespace}${key}`, value, false);
};

export const get = key => {
    return lmoStorage.get(`${namespace}${key}`);
};

export const remove = key => {
    return lmoStorage.remove(`${namespace}${key}`);
};

export const clear = () => {
    return lmoStorage.removeAll();
};