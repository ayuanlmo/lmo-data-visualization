require('./style.t.scss');

import Player from '@/components/Player/index.t';
import EditHeader from '@/components/EditHeader/index.t';
import HotTable from '@/components/HotTable/index.t';
import TextConfigItem from '@/components/TextConfigItem/index.t';
import AudioConfig from '@/components/AudioConfig/index.t';
import PlayerBar from '@/components/PlayerBar/index.t';
import {mapState} from "vuex";
import {PostMessage} from "@lib/PostMessage/index.t";

export default {
    name: 'lmo-edit',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_edit lmo_none_user_select'
            }, [
                h(EditHeader, {
                    props: {
                        title: this.currentTemplate.title
                    },
                    on: {
                        back: () => {
                            this.$confirm('此操作将不会保存您当前模板数据，是否继续？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                require('@/utils').routerPush(this.$router, '/', 'replace');
                            }).catch(() => {
                            });
                        }
                    }
                }),
                h('div', {
                    class: `${this.animationClass} lmo-data_visualization_edit_content`
                }, [
                    h('div', {
                        class: 'lmo-data_visualization_edit_preview lmo_flex_box lmo_position_relative'
                    }, [
                        h('div', {
                            class: 'lmo-data_visualization_edit_preview_player lmo_position_relative'
                        }, [
                            h(Player, {
                                props: {
                                    url: this.currentTemplate.url
                                }
                            }),
                            h(PlayerBar, {
                                props: {
                                    duration: this.currentConfig.duration
                                },
                                on: {
                                    play: () => {
                                        PostMessage({
                                            type: 'Play',
                                            data: {}
                                        });
                                    }
                                }
                            })
                        ]),
                        h('div', {
                            class: 'lmo-data_visualization_edit_preview_table lmo_position_relative'
                        }, [
                            h('div', {
                                class: 'lmo-data_visualization_edit_preview_table_header'
                            }, []),
                            h('div', {
                                class: 'lmo-data_visualization_edit_preview_table_content'
                            }, [
                                h('el-tabs', {
                                    props: {
                                        value: this.tabsActiveName,
                                        'tab-position': 'left'
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
                                                    ...i.data
                                                }
                                            }, [h(i.template)])
                                        );
                                    })
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        );
    },
    data() {
        return {
            tabsActiveName: 'data',
            animationClass: ' animated zoomIn',
            tabs: [
                {
                    data: {
                        name: 'data',
                        label: '数据'
                    },
                    template: HotTable
                },
                {
                    data: {
                        name: 'style',
                        label: '样式'
                    },
                    template: TextConfigItem
                },
                {
                    data: {
                        name: 'synthesis',
                        label: '合成'
                    },
                    template: AudioConfig
                }
            ]
        };
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.animationClass = '';
            }, 2000);
        });
    },
    computed: {
        ...mapState({
            currentTemplate: state => state.appStore.currentTemplate,
            currentConfig: state => state.appStore.currentConfig
        })
    }
};