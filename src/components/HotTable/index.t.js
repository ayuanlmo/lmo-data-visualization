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
                class: 'lmo-data_visualization_config_item'
            }, [
                h('div', {
                    class: 'data_visualization_config_item_card_title',
                    style: 'margin-bottom:0;'
                }, ['编辑数据']),
                h('div', {
                    class: 'data_visualization_config_item_card_title lmo-button_group lmo_position_relative lmo_flex_box'
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
        downloadDefaultCSV() {
            require('@/utils').downloadFile({
                download: this.currentTemplate.title,
                href: require('@/utils').toCSV(this.currentConfig.defaultData)
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

                    console.log(_);

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
