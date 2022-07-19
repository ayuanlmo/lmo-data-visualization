require('./style.t.scss');

import {mapState} from "vuex";
import {PostMessage} from '@/lib/PostMessage/index.t';
import {ColorConfigComponent, ColorOption, renderColorOptionExcludeKey} from "@/const/Default.t";
import {UPDATE_BACKGROUND_IMAGE} from '@/const/MessageType.t';
import AnimateView from '@/components/AnimateView/index.t';
import ColorMode from '@/components/ColorMode/index.t';

export default {
    name: 'lmo-color_config_item',
    render(h) {
        return (
            h('div', {
                class: 'lmo-color_config_item'
            }, [
                this.configColorTemplate,
                h('div', {
                    class: 'lmo-color_box'
                }, [
                    h('div', {
                        class: 'lmo-color_box_content lmo_flex_box'
                    }, [
                        h('div', {
                            class: 'lmo-color_box_label'
                        }, ['背景颜色']),
                        h('div', {
                            class: 'lmo-color_box_option'
                        }, [
                            h('lmo-color-picker', {
                                props: {
                                    value: this.configTemplateBackground.color
                                },
                                on: {
                                    change: (e) => {
                                        this.configTemplateBackground.color = e;
                                    }
                                }
                            })
                        ])
                    ])
                ]),
                h('div', {
                    class: 'lmo-color_box'
                }, [
                    h('div', {
                        class: 'lmo-color_box_content lmo_flex_box'
                    }, [
                        h('div', {
                            class: 'lmo-color_box_label'
                        }, ['标题动画']),
                        h('div', {
                            class: 'lmo-color_box_option'
                        }, [
                            h(AnimateView)
                        ])
                    ])
                ])
            ])
        );
    },
    data() {
        return {
            configColor: {},
            configColorTemplate: null,
            configTemplateBackground: {
                color: '#0C2856',
                image: '',
                arrange: '0% 0% / 100% 100%'
            },
            colorModeTemplate: null,
            colorMode: {
                type: 'Theme',
                config: {
                    Monotone: {
                        color: '#fff'
                    },
                    Gradient: {
                        color: ['#88D085FF', '#88d085']
                    }
                }
            },
            templateBackgroundType: '拉伸',
            configThemeColorTemplate: null
        };
    },
    methods: {
        initConfigColor() {
            Object.keys(this.currentConfigColor).map((i) => {
                if (!renderColorOptionExcludeKey.includes(i))
                    this.configColor[i] = this.currentConfigColor[i];
            });
            this.initConfigColorTemplate();
        },
        initConfigColorTemplate(h = this.$createElement) {
            this.configColorTemplate = [];
            Object.keys(this.configColor).map(i => {
                if ('value' in this.configColor[i]) {
                    this.configColorTemplate.push(
                        h('div', {
                            class: 'lmo-color_box'
                        }, [
                            h('div', {
                                class: 'lmo-color_box_content lmo_flex_box'
                            }, [
                                h('div', {
                                    class: 'lmo-color_box_label'
                                }, [`${this.configColor[i].label}`]),
                                h('div', {
                                    class: 'lmo-color_box_option'
                                }, [
                                    this.renderComponent(i)
                                ])
                            ])
                        ])
                    );
                }
            });
        },
        renderComponent(i) {
            const _Component = this.configColor[i]['type'];
            const h = this.$createElement;

            if (!ColorConfigComponent.includes(_Component)) {
                this.$message.warning(`[${_Component}不是一个受支援的组件]`);
                return h('span');
            }
            if (_Component === 'lmo-color-picker')
                return h(_Component, {
                    props: {
                        value: this.configColor[i].value
                    },
                    on: {
                        change: (e) => {
                            this.configColor[i].value = e;
                            this.$store.commit('SET_CURRENT_TEMPLATE_COLOR_SETTING', this.configColor);
                        }
                    }
                });
        },
        renderMoreColorOption(h = this.$createElement) {
            if ('more' in this.currentConfigColor)
                if ('type' in this.currentConfigColor['more'])
                    return (
                        h('div', {
                            class: 'lmo-color_box_content lmo_flex_box'
                        }, [
                            h('div', {
                                class: 'lmo-color_box_label',
                                style: {
                                    width: '100px'
                                }
                            }, ['颜色模式:']),
                            h('div', {
                                class: 'lmo-color_box_option'
                            }, [
                                h('div', {
                                    class: 'lmo-color_box_option_mode'
                                }, [
                                    h('lmo-select', {
                                        props: {
                                            value: this.currentConfigColor['type'] ?? 'Theme',
                                            option: [
                                                ...ColorOption
                                            ]
                                        },
                                        on: {
                                            change: (e) => {
                                                this.colorMode.type = e;
                                                this.$store.commit('SET_CURRENT_TEMPLATE_COLOR_MODE', this.colorMode);
                                            }
                                        }
                                    }),
                                    h('div', {
                                        class: 'lmo-color_box_option_mode_picker'
                                    }, [
                                        h(ColorMode, {
                                            on: {
                                                change: (e) => {
                                                    this.colorMode.config = e;
                                                    this.$store.commit('SET_CURRENT_TEMPLATE_COLOR_MODE', this.colorMode);
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ])
                        ])
                    );
            return h('');
        },
        setTemplateBackground() {
            PostMessage({
                type: UPDATE_BACKGROUND_IMAGE,
                data: this.configTemplateBackground
            });
        }
    },
    mounted() {
        this.initConfigColor();
        // this.initConfigThemeColorTemplate();
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
                // this.initConfigThemeColorTemplate();
            }
        },
        configTemplateBackground: {
            deep: true,
            handler() {
                this.$refs.BackgroundOption.className = this.configTemplateBackground.image === '' ? 'lmo_hide' : '';
                this.$store.commit('SET_TEMPLATE_CURRENT_BACKGROUND_CONF', this.configTemplateBackground);
                this.setTemplateBackground();
            }
        }
    },
    computed: {
        ...mapState({
            currentConfigColor: state => state.appStore.currentConfig.color ?? []
        })
    }
};