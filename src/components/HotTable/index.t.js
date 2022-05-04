import {HotTable} from '@handsontable/vue';
import 'handsontable/dist/handsontable.full.css';

const HotTableConfig = require('@/config/HotTable');

export default {
    name: 'lmo-hot-table',
    render(h) {
        return (
            h(HotTable, {
                props: {
                    ...HotTableConfig
                }
            })
        );
    }
};