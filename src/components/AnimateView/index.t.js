require('./style.t.scss');

import AnimateList from '@/components/AnimateList/index.t';
import {PostMessage} from "@lib/PostMessage/index.t";

export default {
    name: 'lmo-animate_view',
    data() {
        return {
            visible: true,
            animateName: 'rubberBand'
        };
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-animate_view'
            }, [
                h('div', {
                    class: 'lmo-animate_view_content lmo_theme_color lmo_cursor_pointer lmo_none_user_select',
                    on: {
                        click: () => {
                            this.$refs.AnimateList.show();
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
                                type: 'UpdateAnimateName',
                                data: e
                            });
                            console.log(this.animateName);
                            this.animateName = e;
                        }
                    }
                })
            ])
        );
    }
};