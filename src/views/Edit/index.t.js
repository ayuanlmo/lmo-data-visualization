require('./style.t.scss');

import HotTable from '@/components/HotTable/index.t';
import Player from '@/components/Player/index.t';
import EditConfig from '@/components/EditConfig/index.t';
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
                h('el-page-header', {
                    props: {
                        content: this.currentTemplate.title ?? '模板编辑'
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
                            h(HotTable)
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
    }
};