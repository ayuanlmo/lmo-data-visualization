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
import {get} from '@/lib/Storage';
import {CURRENT_TEMPLATE, WELCOME_STATE} from "@const/StorageKtys.t";

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
        const current_template = get(CURRENT_TEMPLATE);
        const welcome_state = get(WELCOME_STATE);

        if (require('@/config/AppConfig').pages.welcome) {
            if (welcome_state === null || welcome_state === '0')
                return routerPush(this.$router, '/welcome', 'replace');
        } else
            return routerPush(this.$router, '/', 'replace');

        if (current_template !== null)
            await this.$store.commit('SET_CURRENT_TEMPLATE', JSON.parse(current_template));
        else
            return routerPush(this.$router, '/', 'replace');
    }
};