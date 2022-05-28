require('./style.t.scss');
import TemplateItem from '../TemplateItem/index.t';
import {set} from '@/lib/Storage';

export default {
    name: 'lmo-template_view',
    data() {
        return {
            TemplateData: []
        };
    },
    mounted() {
        this.$store.dispatch('GET_TEMPLATE_LIST').then(res => {
            this.TemplateData = res.data.list;
        });
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_template_view'
            }, [
                h('div', {
                    class: 'lmo-visualization_template'
                }, [
                    this.TemplateData.map((i) => {
                        return (
                            h(TemplateItem, {
                                props: {
                                    data: i
                                },
                                on: {
                                    click: (i) => {
                                        this.$store.commit('SET_CURRENT_TEMPLATE', i);
                                        set('current_template', JSON.stringify(i));
                                        this.$router.push('/edit');
                                    }
                                }
                            })
                        );
                    })
                ])
            ])
        );
    }
};