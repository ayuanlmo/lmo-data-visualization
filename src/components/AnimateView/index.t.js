require('./style.t.scss');

import AnimateList from '@/components/AnimateList/index.t';
import {PostMessage} from "@/lib/PostMessage/index.t";
import {UPDATE_ANIMATE_NAME} from '@/const/MessageType.t';

export default {
    name: 'lmo-animate_view',
    render(h) {
        return (
            h('div', {
                class: 'lmo-animate_view'
            }, [
                h('div', {
                    class: 'lmo-animate_view_content lmo_theme_color lmo_cursor_pointer lmo_none_user_select',
                    on: {
                        click: () => {
                            this.$refs.AnimateList['show']();
                        }
                    }
                }, [
                    h('p', {
                        class: `animated ${this.animateName} infinite`
                    }, [require('@/config/AppConfig').appName])
                ]),
                h(AnimateList, {
                    ref: 'AnimateList',
                    on: {
                        selectAnimate: (e) => {
                            PostMessage({
                                type: UPDATE_ANIMATE_NAME,
                                data: e
                            });
                            this.animateName = e;
                        }
                    }
                })
            ])
        );
    },
    data() {
        return {
            visible: true,
            animateName: 'rubberBand'
        };
    }
};