require('./style.t.scss');
import TemplateItem from '../TemplateItem/index.t';
import TemplateData from "@/const/TemplateData";


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
                                }
                            })
                        );
                    })
                ])
            ])
        );
    }
};