require('./style.t.scss');

import PreviewTemplateConf from '@/components/PreviewTemplateConf/index.t';
import Preview from "@/components/Preview";
import {mapState} from "vuex";

export default {
    name: 'lmo-edit_header',
    render(h) {
        return (
            h('div', {
                class: 'lmo-edit_header lmo_flex_box'
            }, [
                h(Preview, {
                    ref: 'Preview'
                }),
                h('div', {
                    class: 'lmo-edit_header_left lmo_position_relative lmo_flex_box'
                }, [
                    h('p', {
                        class: 'lmo-edit_header_title lmo_cursor_pointer lmo_hover_theme_color',
                        on: {
                            click: () => {
                                this.$emit('back');
                            }
                        }
                    }, [
                        h('i', {
                            class: 'el-icon-back'
                        }),
                        '返回'
                    ]),
                    h('div', {
                        class: 'lmo-edit_header_sep lmo_position_relative'
                    }),
                    h('div', {
                        class: 'lmo-edit_header_content'
                    }, [this.title])
                ]),
                h('div', {}, [
                    h('div', [
                        this.devMode ? h('lmo-button', {
                            props: {
                                text: '😊 查看模板配置文件'
                            },
                            on: {
                                click: () => {
                                    this.$refs.PreviewTemplateConf['show']();
                                }
                            }
                        }) : h(''),
                        h('lmo-button', {
                            props: {
                                text: '😝 预览'
                            },
                            on: {
                                click: () => {
                                    this.$refs.Preview['show']();
                                }
                            }
                        }),
                        h('lmo-button', {
                            props: {
                                text: '🤞合成'
                            },
                            on: {
                                click: this.startSynthesis
                            }
                        })
                    ])
                ]),
                this.devMode ? h(PreviewTemplateConf, {
                    ref: 'PreviewTemplateConf'
                }) : h('')
            ])
        );
    },
    props: {
        title: {
            type: String,
            default: '编辑模板'
        }
    },
    methods: {
        startSynthesis() {
            this.$confirm('您确定要开始合成吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ws.send(require('@/utils/index').stringToBinary(JSON.stringify({
                    cmd: 'synthesis',
                    data: {
                        templateConfig: {
                            isCustom: 0,
                            ...this.currentConfig
                        },
                        config: {
                            ...this.currentTemplateVideoConfig,
                            audio: {
                                ...this.templateCurrentAudioConfig
                            }
                        },
                        template: this.currentTemplate.template
                    }
                })));
            }).catch(() => {
            });
        }
    },
    computed: {
        ...mapState({
            devMode: state => state.appStore.devMode,
            currentConfig: state => state.appStore.currentConfig,
            currentTemplateVideoConfig: state => state.appStore.currentTemplateVideoConfig,
            currentTemplate: state => state.appStore.currentTemplate,
            templateCurrentAudioConfig: state => state.appStore.templateCurrentAudioConfig
        })
    }
};