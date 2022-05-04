/**
 * Storage core
 * @author ayuanlmo
 * @class Store
 * @constructor
 * @param {String} type Storage medium type
 * **/

class Store {
    constructor(type = 'local', win = window ?? global) {
        this.Storage = type === 'local' ? win.localStorage : win.sessionStorage;
    }

    set(key, val, sync = ![]) {
        if (key !== '') {
            if (sync) return new Promise((resolve, reject) => {
                if (this.Storage.setItem(key, require('@/utils').toString(val)) === undefined) resolve(true);
                else reject(this);
            });
            this.Storage.setItem(key, require('@/utils').toString(val));
        }
    }

    setAll(data) {
        if (require('@/utils').isArray(data))
            data.forEach(i => {
                if (i.key !== '')
                    if (i.value !== '' && require('@/utils').toString(i.value) !== '')
                        this.Storage.setItem(i.key, i.value);
            });
        return this;
    }

    getKeys() {
        const arr = [];

        for (let i = 0; i < this.Storage.length; i += 1) {
            arr.push(this.Storage.key(i));
        }
        return arr;
    }

    forEach() {
        const arr = [];

        for (let i = 0; i < this.Storage.length; i += 1) {
            const k = this.Storage.key(i);

            arr.push({
                key: k,
                value: this.get(k)
            });
        }
        return arr;
    }

    remove(key) {
        if (key !== '')
            return this.Storage.removeItem(key);
    }

    is(key) {
        //遍历世界
        this.forEach().find(i => {
            //只为寻找你
            return i.key === key;
        });
    }

    get(key) {
        return this.Storage.getItem(key);
    }

    removeAll() {
        this.Storage.clear();
    }
}

export default Store;