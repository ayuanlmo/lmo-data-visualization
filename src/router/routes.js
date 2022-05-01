const routes = [
    {
        path: '/',
        name: 'lmo-home',
        component: () => import('../views/Home/index.t')
    }
]
export default routes;