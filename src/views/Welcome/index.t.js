require('./style.t.scss');

import {set} from "@lib/Storage";
import {WELCOME_STATE} from "@const/StorageKtys.t";

export default {
    name: 'lmo-welcome',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_welcome lmo_none_user_select',
                style: {
                    background: `url("${require('@static/svg/welcome-bg.svg')}") no-repeat`,
                    'background-size': 'cover'
                }
            }, [
                h('div', {
                    class: 'lmo-welcome_content lmo_flex_box bounceInRight animated'
                }, [
                    h('div', [
                        h('img', {
                            attrs: {
                                alt: 'logo',
                                src: require('@static/logo.png')
                            }
                        })
                    ]),
                    h('div', {
                        class: 'lmo-welcome_content_app_info'
                    }, [
                        h('p', {
                            class: 'lmo-welcome_content_app_info_name lmo_color_white lmo_flex_box'
                        }, [
                            require('@config/AppConfig').appName.replace('l', 'l'.toUpperCase()),
                            h('div', {
                                class: 'lmo-welcome_content_app_info_name_button lmo_cursor_pointer_hover lmo_color_white_background',
                                on: {
                                    click: async () => {
                                        await set(WELCOME_STATE, '1');
                                        await require('@/utils').routerPush(this.$router, '/', 'replace');
                                    }
                                }
                            }, [
                                h('p', {
                                    class: 'lmo-welcome_content_app_info_name_button_text lmo_theme_color'
                                }, [
                                    '立即创作',
                                    h('img', {
                                        class: 'bounce animated infinite',
                                        attrs: {
                                            alt: 'right-icon',
                                            src: require('@static/svg/right.svg')
                                        }
                                    })
                                ])
                            ])
                        ]),
                        h('p', [
                            h('span', {
                                class: 'lmo_welcome_content_app_info_author'
                            }, [
                                'by ',
                                require('@config/AppConfig').appAuthor
                            ])
                        ])
                    ])
                ]),
                h('div', {
                    class: 'lmo_welcome_footer lmo_color_white bounceInLeft animated'
                }, [
                    h('span', [
                        'Powered by ffmpeg and Node.js'
                    ]),
                    h('span', [
                        'Design by 阿柒'
                    ])
                ])
            ])
        );
    }
};