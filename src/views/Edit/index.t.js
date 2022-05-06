require('./style.t.scss');

import Header from '@/components/Header/index.t';
import HotTable from '@/components/HotTable/index.t';
import Player from '@/components/Player/index.t';
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
                            h(Player, {
                                props: {
                                    url: this.currentTemplate.url
                                }
                            })
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