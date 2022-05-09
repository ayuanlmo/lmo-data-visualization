require('./style.t.scss');

import PreviewTemplateConf from '@/components/PreviewTemplateConf/index.t';

export default {
    name: 'lmo-edit_header',
    props: {
        title: {
            type: String,
            default: '编辑模板'
        }
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-edit_header'
            }, [
                h('div', {
                    class: 'lmo-edit_header_left'
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
                        class: 'lmo-edit_header_sep'
                    }),
                    h('div', {
                        class: 'lmo-edit_header_content'
                    }, [this.title])
                ]),
                h('div', {}, [
                    h('div', [
                        h('lmo-button', {
                            props: {
                                text: '😊 查看模板配置文件'
                            },
                            on: {
                                click: () => {
                                    this.$refs.PreviewTemplateConf.show();
                                }
                            }
                        }),
                        h('lmo-button', {
                            props: {
                                text: '😝 预览'
                            }
                        })
                    ])
                ]),
                h(PreviewTemplateConf, {
                    ref: 'PreviewTemplateConf'
                })
            ])
        );
    }
};