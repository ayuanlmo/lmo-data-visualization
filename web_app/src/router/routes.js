const routes = [
    {
        path: '/',
        name: 'lmo-home',
        component: () => import('../views/Home/index.t')
    },
    {
        path: '/edit',
        name: 'lmo-edit',
        component: () => import('../views/Edit/index.t')
    },
    {
        path: '/welcome',
        name: 'lmo-welcome',
        component: () => import('../views/Welcome/index.t')
    }
];

export default routes;