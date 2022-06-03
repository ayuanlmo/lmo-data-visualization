require('./style.t.scss');

import {mapState} from "vuex";
import {PostMessage} from '@/lib/PostMessage/index.t';
import {UploadImageTypes} from "@const/Default.t";
import AnimateView from '@components/AnimateView/index.t';

export default {
    name: 'lmo-color_config_item',
    render(h) {
        return (
            h('div', {
                class: 'lmo-color_config_item'
            }, [
                this.configColorTemplate,
                this.configThemeColorTemplate,
                h('div', {
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
                        }, ['背景图片:']),
                        h('div', {
                            class: 'lmo-color_box_option',
                            style: {
                                display: 'flex'
                            }
                        }, [
                            h('div', {
                                class: 'lmo-color_box_option',
                                on: {
                                    click: this.selectFile
                                }
                            }, [
                                h('div', {
                                    class: 'lmo-upload_box lmo_cursor_pointer'
                                }, [
                                    h('i', {
                                        class: 'el-icon-plus avatar-uploader-icon'
                                    })
                                ])
                            ]),
                            h('div', {
                                style: {
                                    marginLeft: '1rem'
                                },
                                class: 'lmo_hide',
                                ref: 'BackgroundOption'
                            }, [
                                <el-radio-group v-model={this.templateBackgroundType} onChange={(n) => {
                                    if (n === '拉伸')
                                        this.configTemplateBackground.arrange = '0% 0% / 100% 100%';
                                    if (n === '横铺')
                                        this.configTemplateBackground.arrange = '0% 0% / 100%';
                                    if (n === '纵铺')
                                        this.configTemplateBackground.arrange = '0% 0% / auto 100%';

                                }} size={'mini'}>
                                    <el-radio-button label="拉伸"/>
                                    <el-radio-button label="横铺"/>
                                    <el-radio-button label="纵铺"/>
                                </el-radio-group>,
                                h('lmo-button', {
                                    style: {
                                        marginLeft: '1rem'
                                    },
                                    props: {
                                        text: '删除'
                                    },
                                    on: {
                                        click: () => this.configTemplateBackground.image = ''
                                    }
                                })
                            ])
                        ])
                    ])
                ]),
                h('div', {
                    class: 'lmo-color_box'
                }, [
                    h('div', {
                        class: 'lmo-color_box_content'
                    }, [
                        h('div', {
                            class: 'lmo-color_box_label'
                        }, ['背景颜色：']),
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
                        class: 'lmo-color_box_content'
                    }, [
                        h('div', {
                            class: 'lmo-color_box_label'
                        }, ['标题动画：']),
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
    methods: {
        initConfigColor() {
            Object.keys(this.currentConfigColor).map((i) => {
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
                                class: 'lmo-color_box_content'
                            }, [
                                h('div', {
                                    class: 'lmo-color_box_label'
                                }, [`${this.configColor[i].label}:`]),
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
        initConfigThemeColorTemplate(h = this.$createElement) {
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
        },
        setTemplateBackground() {
            PostMessage({
                type: 'UpdateBackground_image',
                data: this.configTemplateBackground
            });
        },
        selectFile() {
            const i = document.createElement('input');

            i.type = 'file';

            i.addEventListener('change', () => {
                const file = i.files[0];

                if (UploadImageTypes.indexOf(file.type) !== -1) {
                    if (file.size > 1024 * 1024 * 5)
                        return this.$message.warning(`${file.name}文件过大，请不要超过5M。`);
                    require('@utils/index').toBase64(file).then(res => {
                        this.configTemplateBackground.image = res;
                    });
                } else
                    this.$message.warning(`${file.name}是一个不受支援的文件。`);
            });

            i.click();
        }
    },
    computed: {
        ...mapState({
            currentConfigColor: state => state.appStore.currentConfig.color,
            currentConfigThemeColor: state => state.appStore.currentConfig.themeColors
        })
    },
    data() {
        return {
            configColor: {},
            configColorTemplate: null,
            configTemplateBackground: {
                color: '#fff',
                image: '',
                arrange: '0% 0% / 100% 100%'
            },
            templateBackgroundType: '拉伸',
            configThemeColorTemplate: null,
            themeColorIndex: '0'
        };
    },
    mounted() {
        this.initConfigColor();
        this.initConfigThemeColorTemplate();
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
        },
        configTemplateBackground: {
            deep: true,
            handler() {
                this.$refs.BackgroundOption.className = this.configTemplateBackground.image === '' ? 'lmo_hide' : '';
                PostMessage({
                    type: 'UpdateBackground_image',
                    data: this.configTemplateBackground
                });
                this.setTemplateBackground();
            }
        }
    }
};