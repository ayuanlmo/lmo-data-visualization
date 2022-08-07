require('./style.scss');

import {UploadImageTypes} from "@const/Default.t";
import {PostMessage} from "@lib/PostMessage/index.t";
import {UPDATE_BACKGROUND_IMAGE} from "@const/MessageType.t";

export default {
    name: 'lmo-background_config',
    render(h) {
        return (
            h('div', {
                class: 'lmo-color_config_item'
            }, [
                h('div', {
                    class: 'lmo-color-box'
                }, [
                    h('div', {
                        class: 'lmo-color_box_content lmo_flex_box',
                        style: {
                            color: '#FBFBFD'
                        }
                    }, [
                        h('div', {
                            class: 'lmo-color_box_label',
                            style: {
                                width: '100px',
                                fontStyle: '.8rem'
                            }
                        }, ['背景图片']),
                        h('div', {
                            class: 'lmo-color_box_option',
                            style: {
                                display: 'flex'
                            }
                        }, [
                            h('div', {
                                class: 'lmo-color_box_option',
                                on: {
                                    click: () => {
                                        require('@/utils/index').selectFile().then(_ => {
                                            if (UploadImageTypes.includes(_.type)) {
                                                if (_.size > 1024 * 1024 * 5)
                                                    return this.$message.warning(`[${_.name}] 文件过大，请不要超过5M。`);
                                                require('@utils/index').toBase64(_).then(r => {
                                                    this.configTemplateBackground.image = r;
                                                });
                                            } else
                                                this.$message.warning(`[${_.name}] 是一个不受支援的文件。`);
                                        });
                                    }
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
                                <el-radio-group v-model={this['templateBackgroundType']} onChange={(n) => {
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
                ])
            ])
        );
    },
    data() {
        return {
            configTemplateBackground: {
                color: '#0C2856',
                image: '',
                arrange: '0% 0% / 100% 100%'
            },
            templateBackgroundType: '拉伸'
        };
    },
    methods: {
        setTemplateBackground() {
            PostMessage({
                type: UPDATE_BACKGROUND_IMAGE,
                data: this.configTemplateBackground
            });
        }
    },
    watch: {
        configTemplateBackground: {
            deep: true,
            handler() {
                this.$refs.BackgroundOption.className = this.configTemplateBackground.image === '' ? 'lmo_hide' : '';
                this.$store.commit('SET_TEMPLATE_CURRENT_BACKGROUND_CONF', this.configTemplateBackground);
                this.setTemplateBackground();
            }
        }
    }
};