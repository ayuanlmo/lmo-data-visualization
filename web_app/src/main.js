/**
 *   _    __  __  ___
 *  | |  |  \/  |/ _ \
 *  | |__| |\/| | (_) |
 *  |____|_|  |_|\___/
 * **/

import Vue from 'vue';
import Root from './Root.t';
import router from './router';
import store from '@/store';
import Socket from "@lib/Socket/index.t";
import './lib/Element/index.t';
import '@/components/Element/index.t';
import '@/lib/Global/index.t';

const AppConfig = require('@/config/AppConfig');

void ((_) => {
    Vue.config.productionTip = false;
    new Vue({
        render(h) {
            return (
                h(Root)
            );
        },
        created() {
            Vue['prototype'].ws = new Socket(AppConfig.dev ? AppConfig.devProxy.ws : AppConfig.devProxy.wsPath, (msg) => {
                store.commit('SET_SERVER_PUSH_MESSAGE', {
                    currentTime: new Date().getTime(),
                    msg: JSON.stringify(msg)
                });
            }, 2);
        },
        router,
        store
    }).$mount(_.getElementById('lmo-app') ?? '#lmo-app');
})(document);