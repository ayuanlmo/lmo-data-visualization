require('./style/lmo-style.t.scss');
require('./style/lmo-animation.t.scss');
require('./style/lmo-default.t.scss');
require('../public/style/animate.min.css');

import '@/lib/PostMessage/index.t';
import {get} from '@/lib/Storage';
import Socket from '@/lib/Socket/index.t';
import Vue from 'vue';
import Store from './store/index';

Vue.prototype.ws = new Socket(`ws://${location.host}/connectSocket`, (msg) => {
    Store.commit('SET_SERVER_PUSH_MESSAGE', {
        currentTime: '',
        msg: JSON.stringify(msg)
    });
}, 2);

export default {
    name: 'lmo-root',
    created() {
        console.log('ws', this.ws);

        const current_template = get('current_template');

        if (current_template !== null)
            this.$store.commit('SET_CURRENT_TEMPLATE', JSON.parse(current_template));
    },
    render(h) {
        return (
            h('div', {
                attrs: {
                    id: 'lmo-app'
                }
            }, [
                h('transition', {
                    props: {
                        mode: 'out-in',
                        name: 'lmo_t'
                    }
                }, [
                    h('router-view')
                ])
            ])
        );
    }
};