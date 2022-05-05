require('./style.t.scss');

import Header from '@/components/Header/index.t';
import HotTable from '@/components/HotTable/index.t';

export default {
    name: 'lmo-edit',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_edit'
            }, [
                h(Header),
                h('div', {
                    class: 'lmo-data_visualization_edit_content'
                }, [
                    h('div', {
                        class: 'lmo-data_visualization_edit_preview lmo_color_white_background lmo_flex_box'
                    }, [
                        h('div', {
                            class: 'lmo-data_visualization_edit_preview_player'
                        }, [
                            h('div', {
                                class: 'lmo-data_visualization_edit_preview_player_iframe_box'
                            }, [
                                h('iframe', {
                                    attrs: {
                                        src: '/DataVisualizationTemplate/Histogram/index.html'
                                    }
                                })
                            ])
                        ]),
                        h('div', {
                            class: 'lmo-data_visualization_edit_preview_table'
                        }, [
                            h(HotTable)
                        ])
                    ]),
                    h('div', {
                        class: 'lmo-data_visualization_edit_configure lmo_color_white_background'
                    })
                ])
            ])
        );
    },
};