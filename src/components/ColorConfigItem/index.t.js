require('./style.t.scss');

import {mapState} from "vuex";
import {PostMessage} from '@/lib/PostMessage/index.t';

export default {
    name: 'lmo-color_config_item',
    computed: {
        ...mapState({
            currentConfigColor: state => state.appStore.currentConfig.config.text,
            currentConfigThemeColor: state => state.appStore.currentConfig.config.themeColors
        })
    },
    data() {
        return {
            configColor: {},
            configColorTemplate: null,
            configThemeColorTemplate: null,
            themeColorIndex: '0',
            h: null
        };
    },
    render(h) {
        this.h = h;
        console.log(this.configColor);
        return (
            h('div', {
                class: 'lmo-color_config_item'
            }, [
                this.configColorTemplate,
                this.configThemeColorTemplate
            ])
        );
    },
    methods: {
        initConfigColor() {
            Object.keys(this.currentConfigColor).map((i) => {
                this.configColor[i] = this.currentConfigColor[i];
            });
            this.initConfigColorTemplate();
            console.log(this.configColor);
        },
        initConfigColorTemplate(h = this.h) {
            this.configColorTemplate = [];
            Object.keys(this.configColor).map(i => {
                this.configColorTemplate.push(
                    h('div', {
                        class: 'lmo-color_box'
                    }, [
                        h('div', {
                            class: 'lmo-color_box_content'
                        }, [
                            h('div', {
                                class: 'lmo-color_box_label'
                            }, [`${this.configColor[i].label}颜色:`]),
                            h('div', {
                                class: 'lmo-color_box_option'
                            }, [
                                h('el-color-picker', {
                                    props: {
                                        value: this.configColor[i].color
                                    },
                                    on: {
                                        'active-change': (e) => {
                                            this.configColor[i].color = e;
                                            this.$store.commit('SET_CURRENT_TEMPLATE_TEXT_SETTING', this.configColor);
                                        }
                                    }
                                })
                            ])
                        ])
                    ])
                );
            });
        },
        initConfigThemeColorTemplate(h = this.h) {
            this.configThemeColorTemplate = h('div', {
                class: 'lmo-color_box'
            }, [
                h('div', {
                    class: 'lmo-color_box_content'
                }, [
                    h('div', {
                        class: 'lmo-color_box_label',
                        style: {
                            width: '100px'
                        }
                    }, ['主题颜色:']),
                    h('div', {
                        class: 'lmo-color_box_option'
                    }, [
                        this.currentConfigThemeColor.map((i) => {
                            return (
                                h('div', {
                                    class: 'lmo-theme_item_content lmo_cursor_pointer',
                                    on: {
                                        click: () => {
                                            if (this.themeColorIndex !== i.value) {
                                                this.themeColorIndex = i.value;
                                                PostMessage({
                                                    type: 'UpdateThemeColor',
                                                    data: {
                                                        index: this.themeColorIndex,
                                                        colors: i.colors
                                                    }
                                                });
                                                this.initConfigThemeColorTemplate();
                                            }
                                        }
                                    }
                                }, [
                                    h('div', {
                                        class: [
                                            'lmo-theme_item_box',
                                            this.themeColorIndex === i.value ? 'lmo-theme_item_box_activation_border' : 'lmo-theme_item_box_default_border'
                                        ]
                                    }, [
                                        i.colors.map((j) => {
                                            return (
                                                h('div', {
                                                    style: {
                                                        background: j
                                                    }
                                                })
                                            );
                                        })
                                    ])
                                ])
                            );
                        })
                    ])
                ])
            ]);
        }
    },
    watch: {
        currentConfigColor: {
            deep: true,
            handler() {
                this.initConfigColor();
            }
        },
        currentConfigThemeColor: {
            deep: true,
            handler() {
                this.initConfigThemeColorTemplate();
            }
        }
    }
};