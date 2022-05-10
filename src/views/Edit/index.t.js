require('./style.t.scss');

import HotTable from '@/components/HotTable/index.t';
import Player from '@/components/Player/index.t';
import EditConfig from '@/components/EditConfig/index.t';
import EditHeader from '@/components/EditHeader/index.t';
import {mapState} from "vuex";

export default {
    name: 'lmo-edit',
    computed: {
        ...mapState({
            currentTemplate: state => state.appStore.currentTemplate
        })
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_edit'
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
                                this.$router.replace('/');
                            }).catch(() => {
                            });
                        }
                    }
                }),
                h('div', {
                    class: 'lmo-data_visualization_edit_content'
                }, [
                    h('div', {
                        class: 'lmo-data_visualization_edit_preview lmo_color_white_background lmo_flex_box'
                    }, [
                        h('div', {
                            class: 'lmo-data_visualization_edit_preview_player'
                        }, [
                            h(Player, {
                                props: {
                                    url: this.currentTemplate.url
                                }
                            })
                        ]),
                        h('div', {
                            class: 'lmo-data_visualization_edit_preview_table'
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
                            h(HotTable, {
                                ref: 'ht'
                            })
                        ])
                    ]),
                    h('div', {
                        class: 'lmo-data_visualization_edit_configure lmo_color_white_background'
                    }, [
                        h(EditConfig)
                    ])
                ])
            ])
        );
    },
    methods: {
        downloadDefaultCSV() {
            const a = document.createElement('a');

            a.download = `${this.currentTemplate.title}${new Date().getTime()}`;
            a.href = this.currentTemplate.url.split('index.html')[0] + 'data.csv';
            a.click();
        },
        importLocalData() {
            const i = document.createElement('input');

            i.type = 'file';

            i.addEventListener('change', () => {
                const file = i.files[0];

                const fr = new FileReader();

                fr.readAsText(file);
                fr.onload = (res) => {
                    const data = res.srcElement.result ?? res.target.result;

                    this.$store.commit('SET_CURRENT_CSV_DATA', data);
                    setTimeout(() => {
                        this.$refs.ht.updateData();
                    }, 500);
                };
            });

            i.click();
        }
    }
};