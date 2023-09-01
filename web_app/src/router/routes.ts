import { RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'lmo-home',
        component: defineAsyncComponent(() => import('../views/Home/index.t'))
    },
    {
        path: '/edit',
        name: 'lmo-edit',
        component: defineAsyncComponent(() => import('../views/Edit/index.t'))
    },
    {
        path: '/welcome',
        name: 'lmo-welcome',
        component: defineAsyncComponent(() => import('../views/Welcome/index.t'))
    }
];

export default routes;
