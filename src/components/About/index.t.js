require('./style.t.scss');

const AppConfig = require('@/config/AppConfig');

export default {
    name: 'lmo-about',
    render(h) {
        return (
            h('div', {
                class: 'lmo_about_box'
            }, [
                h('el-dialog', {
                    props: {
                        title: '',
                        width: '40%',
                        visible: this.visible,
                        beforeClose: () => {
                            this.visible = false;
                        },
                        top: '10vh'
                    },
                    class: 'lmo_none_user_select'
                }, [
                    h('img', {
                        class: 'none_user_select cursor_pointer lmo_about_logo animated bounce',
                        attrs: {
                            src: require('@static/svg/lmo-logo.svg')
                        }
                    }),
                    h('div', {
                        class: 'lmo_about_box_title lmo_theme_color animated slideInDown'
                    }, [
                        h('div', [require('@config/AppConfig').appName])
                    ]),
                    h('span', {
                        style: 'color:#FBFBFD;'
                    }, [
                        'By ',
                        h('span', [
                            h('a', {
                                class: 'lmo_hover_theme_color',
                                attrs: {
                                    href: 'https://www.ayuanlmo.cn',
                                    target: '_blank'
                                }
                            }, ['ayuanlmo'])
                        ])
                    ]),
                    h('div', {
                        class: 'lmo_line'
                    }),
                    h('div', {
                        class: 'animated fadeInDown'
                    }, [
                        h('span', {
                            style: 'color:#FBFBFD;'
                        }, [
                            '特别感谢：',
                            AppConfig.specialThanks.map((i, index) => {
                                return (
                                    h('span', [
                                        h('span', {
                                            class: 'lmo_theme_color'
                                        }, [i]),
                                        index === AppConfig.specialThanks.length - 1 ? '' : '、'
                                    ])
                                );
                            })
                        ]),
                        h('div', {
                            class: 'lmo_line'
                        }),
                        h('span', {
                            class: 'lmo_icon'
                        }, [
                            h('a', {
                                attrs: {
                                    title: 'GitHub',
                                    target: '_blank',
                                    href: AppConfig.openSource.github
                                }
                            }, [
                                h('img', {
                                    class: 'lmo_cursor_pointer lmo_none_user_select',
                                    attrs: {
                                        src: require('@static/svg/github.svg')
                                    }
                                })
                            ])
                        ]),
                        h('div', {
                            class: 'lmo_line'
                        }),
                        h('p', [
                            'Powered by ',
                            h('a', {
                                class: 'lmo_theme_color',
                                attrs: {
                                    title: 'nodejs.org',
                                    target: '_blank',
                                    href: 'https://nodejs.org/'
                                }
                            }, [
                                `Node.js`
                            ])
                        ])
                    ])
                ])
            ])
        );
    },
    data() {
        return {
            visible: false
        };
    },
    methods: {
        show() {
            this.visible = true;
        }
    }
};