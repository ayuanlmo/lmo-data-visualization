require('./style.t.scss');

import {createMessage, createMessageBox} from "@lib/BasicInteraction";

const AppConfig = require('@/config/AppConfig');

export default {
    name: 'lmo-template_item',
    render(h) {
        return (
            h('div', {
                class: 'lmo-template_item_content lmo_cursor_pointer',
                on: {
                    click: () => {
                        this.$emit('click', this.data);
                        this.showDescription = false;
                    }
                }
            }, [
                h('div', {
                    class: 'lmo-template_item_content_card lmo_position_relative'
                }, [
                    h('div', {
                        class: 'lmo-template_item_content_img_box lmo_position_absolute',
                        on: {
                            mouseover: () => {
                                this.showDescription = true;
                            },
                            mouseout: () => {
                                this.showDescription = false;
                            }
                        }
                    }, [
                        h('div', {
                            class: this.getDescriptionClass
                        }, [
                            this.customizeTemplate ?
                                h('span', {
                                    class: 'lmo-template_del_icon lmo_flex_box'
                                }, [
                                    h('i', {
                                        class: 'el-icon-delete lmo_hover_theme_color',
                                        on: {
                                            click: (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                createMessageBox({
                                                    confirmButtonText: '确定',
                                                    cancelButtonText: '取消',
                                                    showCancelButton: true,
                                                    title: '提示',
                                                    type: 'warning',
                                                    message: '您确定要删除该模板吗？(删除后不可恢复)'
                                                }).then(() => {
                                                    this.$store.dispatch('DEL_TEMPLATE', {
                                                        id: this.data.id
                                                    }).then(res => {
                                                        if (res.code === 200) {
                                                            createMessage({
                                                                type: 'success',
                                                                message: '删除成功'
                                                            });
                                                            this.$emit('delItem');
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    })
                                ]) : h(''),
                            h('span', {
                                class: 'lmo-template_description_title animated fadeInDown'
                            }, [
                                this.data.title,
                                this.getEditTemplate()
                            ]),
                            h('br'),
                            h('span', {
                                class: 'lmo-template_description_content animated fadeInDown'
                            }, [this.data.description])
                        ]),
                        h('div', {
                            class: 'lmo-template_item_content_img lmo_position_absolute'
                        }, [
                            h('img', {
                                attrs: {
                                    alt: this.data.cover,
                                    src: `${AppConfig.devProxy.http}${this.data.cover}`
                                }
                            })
                        ]),
                        h('div', {
                            class: 'lmo-template_item_content_title lmo_position_absolute'
                        }, [
                            h('div', {
                                class: 'lmo-template_item_content_title_box'
                            }, [
                                h('div', {
                                    class: 'lmo-template_item_title'
                                }, [this.data.title])
                            ])
                        ])
                    ])
                ])
            ])
        );
    },
    props: {
        data: {
            type: Object
        }
    },

    data() {
        return {
            showDescription: false,
            customizeTemplate: this.data.type === 'customize'
        };
    },
    computed: {
        getDescriptionClass() {
            const _ = 'lmo-template_item_content_img lmo-template_item_content_description lmo_position_absolute';

            return this.showDescription ? `${_}` : `${_} lmo_hide`;
        }
    },
    methods: {
        getEditTemplate(h = this.$createElement) {
            if (this.customizeTemplate) {
                return h('i', {
                    class: 'el-icon-edit-outline lmo_hover_theme_color',
                    on: {
                        click: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            return this.$emit('edit', {
                                id: this.data.id,
                                title: this.data.title,
                                description: this.data.description
                            });
                        }
                    }
                });
            }
            return '';
        }
    },
    watch: {
        'data': {
            deep: true,
            handler() {
                this.customizeTemplate = this.data.type === 'customize';
            }
        }
    }
};
