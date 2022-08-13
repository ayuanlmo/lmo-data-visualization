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
require('./style/lmo-animation.t.scss');
require('./style/lmo-default.t.scss');
require('../public/style/animate.min.css');
require('./style/lmo-components.scss');

import '@/lib/PostMessage/index.t';
import {get} from '@/lib/Storage';

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
    created() {
        const current_template = get('current_template');

        if (current_template !== null)
            this.$store.commit('SET_CURRENT_TEMPLATE', JSON.parse(current_template));
    }
};