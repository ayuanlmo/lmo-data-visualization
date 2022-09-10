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
                        require('@/config/AppConfig').dev ? h('lmo-button', {
                            props: {
                                text: '查看模板配置文件'
                            },
                            on: {
                                click: () => {
                                    this.$refs.PreviewTemplateConf['show']();
                                }
                            }
                        }) : h(''),
                        h('lmo-button', {
                            props: {
                                text: '预览'
                            },
                            on: {
                                click: () => {
                                    this.$refs.Preview['show']();
                                }
                            }
                        }),
                        h('lmo-button', {
                            props: {
                                text: '合成'
                            },
                            on: {
                                click: this.startSynthesis
                            }
                        }),
                        h('lmo-button', {
                            props: {
                                text: '保存为自定义模板'
                            },
                            on: {
                                click: () => this.createTemplateVisible = true
                            }
                        })
                    ])
                ]),
                h('el-dialog', {
                    props: {
                        visible: this.createTemplateVisible,
                        width: '20%',
                        title: '自定义模板信息',
                        'before-close': () => this.createTemplateVisible = false
                    }
                }, [
                    h('div', [
                        h('lmo-input', {
                            props: {
                                value: this.customize.title
                            },
                            on: {
                                change: e => this.customize.title = e
                            }
                        })
                    ]),
                    h('div', [
                        h('lmo-input', {
                            props: {
                                value: this.customize.description
                            },
                            on: {
                                change: e => this.customize.description = e
                            }
                        })
                    ]),
                    h('span', {
                        slot: 'footer'
                    }, [
                        h('lmo-button', {
                            props: {
                                text: '立即保存'
                            },
                            on: {
                                click: () => this.createTemplate()
                            }
                        })
                    ])
                ]),
                h(PreviewTemplateConf, {
                    ref: 'PreviewTemplateConf'
                })
            ])
        );
    },
    props: {
        title: {
            type: String,
            default: '编辑模板'
        }
    },
    data() {
        return {
            createTemplateVisible: false,
            customize: {
                title: '',
                description: ''
            }
        };
    },
    methods: {
        createTemplate() {
            this.ws.send(require('@/utils/index').stringToBinary(JSON.stringify({
                cmd: 'createTemplate',
                data: {
                    customize: {
                        ...this.customize
                    },
                    templateConfig: {
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
        },
        startSynthesis() {
            this.$prompt('请输入项目名称(可空)', '发起合成', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({value}) => {
                this.ws.send(require('@/utils/index').stringToBinary(JSON.stringify({
                    cmd: 'synthesis',
                    data: {
                        name: value ?? '',
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
            currentConfig: state => state.appStore.currentConfig,
            currentTemplateVideoConfig: state => state.appStore.currentTemplateVideoConfig,
            currentTemplate: state => state.appStore.currentTemplate,
            templateCurrentAudioConfig: state => state.appStore.templateCurrentAudioConfig
        })
    }
};