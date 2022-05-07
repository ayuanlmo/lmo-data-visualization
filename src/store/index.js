import Vue from 'vue';
import Vuex from 'vuex';
import appStore from './AppStore/index.t';

Vue.use(Vuex);

export const Store = new Vuex.Store({
    modules: {
        appStore: {...appStore}
    }
});

export default Store;