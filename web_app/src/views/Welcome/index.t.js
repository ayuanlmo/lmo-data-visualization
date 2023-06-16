require('./style.t.scss');

import {set} from "@lib/Storage";
import {WELCOME_STATE} from "@const/StorageKtys.t";

const icpConf = require('@/config/Icp');

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
                    h('div', {
                        class: 'lmo-welcome_content_logo_content lmo_position_absolute'
                    }, [
                        h('img', {
                            attrs: {
                                alt: 'logo',
                                src: require('@static/logo.png')
                            }
                        })
                    ]),
                    h('div', {
                        class: 'lmo-welcome_content_app_info lmo_position_absolute'
                    }, [
                        h('p', {
                            class: 'lmo-welcome_content_app_info_name lmo_color_white lmo_flex_box'
                        }, [
                            h('div', {
                                class: 'lmo-welcome_content_app_info_name_content'
                            }, [
                                require('@config/AppConfig').appName.replace('l', 'l'.toUpperCase())
                            ])
                        ]),
                        h('p', [
                            h('span', {
                                class: 'lmo_welcome_content_app_info_author'
                            }, [
                                'by ',
                                require('@config/AppConfig').appAuthor
                            ])
                        ]),
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
                    ])
                ]),
                h('div', {
                    class: 'lmo_welcome_footer lmo_color_white bounceInLeft animated'
                }, [
                    h('div',{},[
                        h('span', [
                            'Powered by ffmpeg and Node.js'
                        ]),
                        h('span', [
                            'Design by 阿柒'
                        ])
                    ]),
                    h('div', {}, [
                        h('a', {
                            class:'lmo_color_white lmo_hover_theme_color',
                            attrs: {
                                href: 'http://www.beian.miit.gov.cn/',
                                target: '_blank'
                            }
                        }, [
                            icpConf.icpFilingNo
                        ]),
                        h('a', {
                            class:'lmo_color_white lmo_hover_theme_color',
                            attrs: {
                                href: 'http://www.beian.gov.cn/portal/registerSystemInfo',
                                target: '_blank'
                            }
                        }, [
                            icpConf.publicSecurityNetworkFilingNo
                        ])
                    ])
                ])
            ])
        );
    }
};