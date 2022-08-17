require('./style.t.scss');

import {HotTable} from '@handsontable/vue';
import {mapState} from "vuex";
import {PostMessage} from "@lib/PostMessage/index.t";
import {UPDATE_DATA} from '@/const/MessageType.t';
import 'handsontable/dist/handsontable.full.css';

const HotTableConfig = require('@/config/HotTable');

export default {
    name: 'lmo-hot-table',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_config_item_content'
            }, [
                h('div', {
                    class: 'lmo_flex_box',
                    style: 'justify-content: space-between;margin-bottom: 1rem;'
                }, [
                    h('div', {
                        class: 'lmo-data_visualization_config_item_card_title',
                        style: 'margin-bottom:0;'
                    }, ['编辑数据']),
                    h('div', {
                        class: 'lmo-button_group lmo_position_relative lmo_flex_box'
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
                        h('el-dropdown', {
                            props: {
                                trigger: 'click'
                            },
                            style: {
                                marginLeft: '1rem'
                            },
                            on: {
                                command: (e) => {
                                    this.downloadDefaultData(e);
                                }
                            }
                        }, [
                            h('lmo-button', {
                                props: {
                                    text: '导出示例数据',
                                    plain: true
                                }
                            }),
                            h('el-dropdown-menu', {
                                slot: 'dropdown'
                            }, [
                                h('el-dropdown-item', {
                                    props: {
                                        command: 'CSV'
                                    }
                                }, ['CSV']),
                                h('el-dropdown-item', {
                                    props: {
                                        command: 'JSON'
                                    }
                                }, ['JSON'])
                            ])
                        ])
                    ])
                ]),
                h(HotTable, {
                    ref: 'HotTable',
                    props: {
                        settings: {
                            ...HotTableConfig.settings,
                            afterChange: this.hotTableAfterChange
                        },
                        licenseKey: HotTableConfig.licenseKey
                    }
                })
            ])
        );
    },
    methods: {
        downloadDefaultData(type = 'CSV') {
            require('@/utils').downloadFile({
                download: this.currentTemplate.title,
                href: type === 'CSV' ? require('@/utils').toCSV(this.currentConfig.defaultData) : require('@/config/AppConfig').devProxy.http + this.currentTemplate.url.replace('index.html', '') + 'data.json'
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
                    const _ = res.srcElement.result.split('\r\n') ?? res.target.result.split('\r\n');

                    this.$store.commit('SET_CURRENT_CSV_DATA', _);
                    setTimeout(() => {
                        this.$refs.ht.updateData();
                    }, 500);
                };
            });
        },
        hotTableAfterChange(change, s) {
            if (s === 'edit')
                this.updateData();
        },
        updateData() {
            const csvData = [];

            this.$refs.HotTable['hotInstance'].getData().map(i => {
                if (i.length !== 0 && i[0] !== null)
                    if (i.length !== 0)
                        csvData.push(i.filter(_ => {
                            return _ !== null;
                        }));
            });
            this.$store.commit('SET_CURRENT_CSV_DATA', csvData);
            PostMessage({
                type: UPDATE_DATA,
                data: csvData
            });
        },
        initHotTableData() {
            if (this.csvData !== '' && this.csvData !== undefined && this.csvData !== null) {
                const hotTableData = [];

                this.csvData.map((i) => {
                    if (typeof i === "string")
                        hotTableData.push(i.split(','));
                    else
                        hotTableData.push(i);
                });
                this.$refs.HotTable['hotInstance'].loadData(hotTableData.filter(i => {
                    return i !== '';
                }));
            }
        }
    },
    mounted() {
        this.initHotTableData();
        this.$nextTick(() => {
            const el = document.getElementsByClassName('ht_clone_bottom handsontable');

            if (el.length !== 0)
                el[0].remove();
        });
    },
    watch: {
        csvData: {
            deep: true,
            handler: async function () {
                await this.initHotTableData();
            }
        }
    },
    computed: {
        ...mapState({
            csvData: state => state.appStore.currentConfig.data,
            currentTemplate: state => state.appStore.currentTemplate,
            currentConfig: state => state.appStore.currentConfig
        })
    }
};
