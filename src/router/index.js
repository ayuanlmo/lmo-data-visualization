import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import * as Nprogress from '@/lib/Nprogress/index.t';

const routerConf = require('@/config/AppConfig').router;

Vue.use(VueRouter);

const RouterCore = new VueRouter({
    ...{
        mode: routerConf.mode,
        base: routerConf.base,
        routes: [].concat(...routes)
    }
});

RouterCore.beforeEach(async (to, from, next) => {
    Nprogress.start();
    await next();
});

RouterCore.afterEach(async () => {
    await Nprogress.done();
});

export default RouterCore;