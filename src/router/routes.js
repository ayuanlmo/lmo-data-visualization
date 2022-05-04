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
    }
];

export default routes;