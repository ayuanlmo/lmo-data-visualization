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
                        '่ฟๅ'
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
                                text: '๐ ๆฅ็ๆจกๆฟ้็ฝฎๆไปถ'
                            },
                            on: {
                                click: () => {
                                    this.$refs.PreviewTemplateConf['show']();
                                }
                            }
                        }) : h(''),
                        h('lmo-button', {
                            props: {
                                text: '๐ ้ข่ง'
                            },
                            on: {
                                click: () => {
                                    this.$refs.Preview['show']();
                                }
                            }
                        }),
                        h('lmo-button', {
                            props: {
                                text: '๐คๅๆ'
                            },
                            on: {
                                click: this.startSynthesis
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
            default: '็ผ่พๆจกๆฟ'
        }
    },
    methods: {
        startSynthesis() {
            this.$confirm('ๆจ็กฎๅฎ่ฆๅผๅงๅๆๅ?', 'ๆ็คบ', {
                confirmButtonText: '็กฎๅฎ',
                cancelButtonText: 'ๅๆถ',
                type: 'warning'
            }).then(() => {
                console.log({
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
                );
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
            currentConfig: state => state.appStore.currentConfig,
            currentTemplateVideoConfig: state => state.appStore.currentTemplateVideoConfig,
            currentTemplate: state => state.appStore.currentTemplate,
            templateCurrentAudioConfig: state => state.appStore.templateCurrentAudioConfig
        })
    }
};