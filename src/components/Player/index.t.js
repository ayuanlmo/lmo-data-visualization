require('./style.t.scss');

export default {
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_edit_preview_player_iframe_box'
            }, [
                h('iframe', {
                    attrs: {
                        src: this.url
                    }
                })
            ])
        )
    }
}