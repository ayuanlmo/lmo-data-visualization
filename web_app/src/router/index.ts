import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import * as Nprogress from '../lib/Nprogress/index.t';
import appConfig from "../config/AppConfig.js";

const routes: Array<RouteRecordRaw> = require('./routes').default;

const routerConf = appConfig.router;

const router = createRouter({
    history: routerConf.mode === 'history' ? createWebHistory(routerConf.base) : undefined,
    routes: [].concat(...routes),  // 请根据你的需求修改这一行
});

router.beforeEach(async (to, from, next) => {
    Nprogress.start();
    next();
});

router.afterEach(() => {
    Nprogress.done();
});

export default router;
