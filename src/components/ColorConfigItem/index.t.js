require('./style.t.scss');

import {mapState} from "vuex";
import {PostMessage} from '@/lib/PostMessage/index.t';
import {ColorConfigComponent, renderColorOptionExcludeKey} from "@/const/Default.t";
import {UPDATE_BACKGROUND_IMAGE} from '@/const/MessageType.t';
import AnimateView from '@/components/AnimateView/index.t';

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
            }
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
        setTemplateBackground() {
            PostMessage({
                type: UPDATE_BACKGROUND_IMAGE,
                data: this.configTemplateBackground
            });
        }
    },
    mounted() {
        this.initConfigColor();
    },
    watch: {
        configTemplateBackground: {
            deep: true,
            handler() {
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