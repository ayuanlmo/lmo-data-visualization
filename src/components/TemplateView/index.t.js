require('./style.t.scss');

import TemplateItem from '@/components/TemplateItem/index.t';
import {set} from '@/lib/Storage';

export default {
    name: 'lmo-template_view',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_template_view'
            }, [
                h('div', {
                    class: 'lmo-visualization_template'
                }, [
                    this.TemplateData.length === 0 ? <el-empty description="这里暂时啥也没有"></el-empty> :
                        this.TemplateData.map((i) => {
                            return (
                                h(TemplateItem, {
                                    props: {
                                        data: i
                                    },
                                    on: {
                                        click: async (i) => {
                                            this.$store.commit('SET_CURRENT_TEMPLATE', i);
                                            this.$store.commit('RESET_CURRENT_TEMPLATE_CONFIG');
                                            await set('current_template', JSON.stringify(i));
                                            await this.$router.push('/edit');
                                        }
                                    }
                                })
                            );
                        })
                ])
            ])
        );
    },
    data() {
        return {
            TemplateData: []
        };
    },
    mounted() {
        this.$store.dispatch('GET_TEMPLATE_LIST').then(res => {
            this.TemplateData = res.data.list;
        });
    }
};