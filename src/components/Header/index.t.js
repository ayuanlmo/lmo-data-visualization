require('./style.t.scss');

import About from '@/components/About/index.t';
import ViewResource from '@/components/ViewResource/index.t';
import ViewLogs from '@/components/ViewLogs/index.t';

export default {
    name: 'lmo-header',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_header lmo_flex_box'
            }, [
                h('div', {
                    class: 'lmo_flex_box'
                }, [
                    h(About, {ref: 'about'}),
                    h('h3', {
                        class: 'lmo_theme_color lmo_cursor_pointer lmo_none_user_select',
                        on: {
                            click: () => {
                                this.$refs.about['show']();
                            }
                        }
                    }, [require('@config/AppConfig').appName])
                ]),
                h('div', {
                    class: 'lmo_data_visualization_header_option lmo_position_relative'
                }, [
                    h(ViewResource, {ref: 'ViewResource'}),
                    h('div', {
                        class: 'lmo_data_visualization_header_option_buttons lmo_position_relative'
                    }, [
                        h('lmo-button', {
                            props: {
                                plain: true,
                                text: h('i', {
                                    class: 'el-icon-film'
                                }, [' 资源库'])
                            },
                            on: {
                                click: () => {
                                    this.$refs.ViewResource['show']();
                                }
                            }
                        }),
                        h('lmo-button', {
                            props: {
                                plain: true,
                                text: h('i', {
                                    class: 'el-icon-tickets'
                                }, [' 查看日志'])
                            },
                            on: {
                                click: () => {
                                    this.$refs.ViewLogs['show']();
                                }
                            }
                        })
                    ]),
                    h(ViewLogs, {ref: 'ViewLogs'})
                ])
            ])
        );
    }
};