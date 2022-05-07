import Vue from 'vue';
import Root from './Root.t';
import router from './router';
import store from './store';
import './lib/Element/index.t';
import '@/components/Element/index.t';

Vue.config.productionTip = false;

void function (doc) {
    new Vue({
        ...{
            components: {Root},
            template: '<Root /> ',
            router,
            store,
            render: h => h(Root)
        }
    }).$mount(doc.getElementById('lmo-app') ?? '#lmo-app');
}(document);