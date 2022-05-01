require('./style/lmo-style.t.scss');
require('./style/lmo-animation.t.scss');
require('./style/lmo-default.t.scss');

export default {
    name: 'lmo-root',
    render(h) {
        return (
            h('div', {
                attrs: {
                    id: 'lmo-app'
                }
            }, [
                h('transition', {
                    props: {
                        mode: 'out-in',
                        name: 'lmo_t'
                    }
                }, [
                    h('router-view')
                ])
            ])
        )
    }
}