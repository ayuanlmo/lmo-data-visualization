require('./style.t.scss');

import Header from '@/components/Header/index.t';
import TemplateView from '@/components/TemplateView/index.t';

export default {
    name: 'lmo-home',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization'
            }, [
                h(Header),
                h(TemplateView),
                h('div', {
                    class: 'lmo-data_visualization_footer'
                }, 'Design by @阿柒')
            ])
        );
    }
};