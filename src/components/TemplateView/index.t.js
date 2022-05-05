require('./style.t.scss');
import TemplateItem from '../TemplateItem/index.t';
import TemplateData from "@/const/TemplateData.t";
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
                    TemplateData.map((i) => {
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