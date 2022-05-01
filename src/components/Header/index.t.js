require('./style.t.scss');

export default {
    name: 'lmo-header',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_header'
            }, [
                h('div', {
                    class: 'lmo_flex_box'
                }, [
                    h('img', {
                        attrs: {
                            src: require('../../assets/svg/lmo-logo.svg')
                        }
                    }),
                    h('h3', {
                        class: 'lmo_theme_color'
                    }, ['lmo-DataVisualization'])
                ])
            ])
        )
    }
}