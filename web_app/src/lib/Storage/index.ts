import AppConfig from "../../config/AppConfig";
import Utils from "../../utils";

namespace MyStorage {
    const storage: Storage = AppConfig.storageOptions.storage === 'local' ? localStorage : sessionStorage;
    const namespace: string = AppConfig.storageOptions.namespace;

    export const set = (key: string, value: any): void => {
        return storage.setItem(`${namespace}${key}`, Utils.toString(value));
    }

    export const get = (key: string): string | null => {
        return storage.getItem(`${namespace}${key}}`);
    }

    export const remove = (key: string): void => {
        return storage.removeItem(key);
    }

    export const clear = (): void => {
        return storage.clear();
    }
}

export default MyStorage;
