require('./style.t.scss');

import TextConfigItem from '@/components/TextConfigItem/index.t';
import AudioConfig from '@/components/AudioConfig/index.t';

export default {
    name: 'lmo-edit_config',
    render(h) {
        return (
            h('div', {
                class: 'lmo-edit_config'
            }, [
                h('div', {
                    class: 'lmo-edit_config_tabs'
                }, [
                    h('el-tabs', {
                        props: {
                            value: this.tabsActiveName
                        },
                        on: {
                            'tab-click': (t) => {
                                this.tabsActiveName = t.name;
                            }
                        }
                    }, [
                        this.tabs.map(i => {
                            return (
                                h('el-tab-pane', {
                                    props: {
                                        ...i
                                    }
                                })
                            );
                        })
                    ])
                ]),
                h('div', {
                    class: 'lmo-edit_config_content'
                }, [
                    h(TextConfigItem, {
                        class: this.tabsActiveName !== 'text_and_theme' ? 'lmo_hide' : ''
                    }),
                    h(AudioConfig, {
                        class: this.tabsActiveName !== 'audio_and_duration' ? 'lmo_hide' : ''
                    })
                ])
            ])
        );
    },
    data() {
        return {
            tabsActiveName: 'text_and_theme',
            tabs: [
                {
                    name: 'text_and_theme',
                    label: '文字 / 主题'
                },
                {
                    name: 'audio_and_duration',
                    label: '音频 / 时间'
                }
            ]
        };
    }
};