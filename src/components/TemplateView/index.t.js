require('./style.t.scss');
import TemplateItem from '../TemplateItem/index.t';

export default {
    name: 'lmo-template_view',
    data() {
        return {
            templateList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        };
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_template_view'
            }, [
                h('div', {
                    class: 'lmo-visualization_template'
                }, [
                    this.templateList.map(() => {
                        return (
                            h(TemplateItem)
                        );
                    })
                ])
            ])
        );
    }
};