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
                            }, [
                                h('div', {
                                    class: 'lmo-data_visualization_edit_preview_table_header_content'
                                }, [
                                    h('lmo-button', {
                                        props: {
                                            text: '上传本地数据',
                                            plain: true
                                        },
                                        on: {
                                            click: this.importLocalData
                                        }
                                    }),
                                    h('lmo-button', {
                                        props: {
                                            text: '导出示例数据',
                                            plain: true
                                        },
                                        on: {
                                            click: this.downloadDefaultCSV
                                        }
                                    })
                                ])
                            ]),
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
        // console.log('store',);
        return {
            tabsActiveName: 'text_and_theme',
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
                        name: 'text_and_theme',
                        label: '文字 / 颜色'
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
    methods: {
        downloadDefaultCSV() {
            require('@/utils').downloadFile({
                download: this.currentTemplate.title,
                href: this.currentTemplate.url.split('index.html')[0] + 'data.csv'
            }).then(a => {
                a.click();
            });
        },
        importLocalData() {
            require('@/utils/index').selectFile().then(file => {
                if (file.type !== 'text/csv')
                    return this.$message.warning(`[${file.name}]是一个不受支持的文件`);
                const fr = new FileReader();

                fr.readAsText(file);
                fr.onload = (res) => {
                    this.$store.commit('SET_CURRENT_CSV_DATA', res.srcElement.result ?? res.target.result);
                    setTimeout(() => {
                        this.$refs.ht.updateData();
                    }, 500);
                };
            });
        }
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