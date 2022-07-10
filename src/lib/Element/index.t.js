import Vue from 'vue';
import Element from 'element-ui';
import '../../style/element.scss';

void (() => {
    Vue.use(Element, {
        size: 'small'
    });
})();