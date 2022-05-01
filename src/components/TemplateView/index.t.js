require('./style.t.scss');

export default {
    name: 'lmo-template_view',
    render(h) {
        return (
            h('div',{
                class:'lmo-data_visualization_template_view'
            })
        )
    }
}