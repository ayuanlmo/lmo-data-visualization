require('./style.t.scss');

import Header from '../../components/Header/index.t';
import TemplateView from '../../components/TemplateView/index.t';

export default {
    name: 'lmo-home',
    components:{
        Header, TemplateView
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization'
            }, [
                h(Header),
                h(TemplateView)
            ])
        );
    }
};