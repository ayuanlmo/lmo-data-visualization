import {HotTable} from '@handsontable/vue';
import {mapState} from "vuex";
import {PostMessage} from "@lib/PostMessage/index.t";
import 'handsontable/dist/handsontable.full.css';

const HotTableConfig = require('@/config/HotTable');

export default {
    name: 'lmo-hot-table',
    computed: {
        ...mapState({
            csvData: state => state.appStore.currentConfig.data
        })
    },
    render(h) {
        return (
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
        );
    },
    watch: {
        csvData(n) {
            if (n !== '' && n !== undefined && n !== null)
                this.initHotTableData();
        }
    },
    methods: {
        hotTableAfterChange(change, s) {
            if (s === 'edit') {
                let csvData = '';

                this.$refs.HotTable.hotInstance.getData().map(i => {
                    if (i[0] !== null) {
                        let txt = '';

                        i.map(j => {
                            if (j !== null)
                                txt += j + ',';
                        });
                        txt = txt.slice(0, -1);
                        csvData += txt + '\r\n';
                    }
                });
                PostMessage({
                    type: 'UpdateData',
                    data: csvData
                });
            }
        },
        initHotTableData() {
            const hotTableData = [];

            this.csvData.split('\r\n').map((i) => {
                hotTableData.push(i.split(','));
            });
            this.$refs.HotTable.hotInstance.loadData(hotTableData);
        }
    }
};
