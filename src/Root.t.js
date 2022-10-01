/**
 *   _________  _
 * |  _   _  |(_)
 * |_/ | | \_|__   _ .--.   .--./)
 *     | |   [  | [ `.-. | / /'`\;
 *    _| |_   | |  | | | | \ \._//
 *   |_____| [___][___||__].',__`
 *                        ( ( __))
 **/

require('./style/lmo-style.t.scss');
require('@style/lmo-default.t.css');
require('../public/style/animate.min.css');

const routerPush = require('@/utils').routerPush;

import '@/lib/PostMessage/index.t';
import {get, set} from '@/lib/Storage';

export default {
    name: 'lmo-root',
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
                    h('keep-alive', {
                        props: {
                            include: 'lmo-home'
                        }
                    }, [
                        h('router-view')
                    ])
                ])
            ])
        );
    },
    async created() {
        const current_template = get('current_template');
        const welcome_state = get('welcome_state');

        if (welcome_state === null || welcome_state === '0') {
            await set('welcome_state', '1');
            await routerPush(this.$router, 'welcome', 'replace');
        } else {
            routerPush(this.$router, '/', 'replace');
        }

        if (current_template !== null)
            this.$store.commit('SET_CURRENT_TEMPLATE', JSON.parse(current_template));
    }
};