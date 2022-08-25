export default {
    name: 'lmo-media-list',
    render(h) {
        return (
            h('div', {
                class: 'lmo_media-list'
            }, [
                h('el-row', [
                    this.data.map(i => {
                        return (
                            h('el-col', {
                                props: {
                                    span: 4
                                }
                            }, [
                                h('div', {
                                    class: 'lmo_media-list-item',
                                    on: {
                                        click: () => {
                                            this.$emit('click', i);
                                        }
                                    }
                                }, [
                                    h('el-tooltip', {
                                        props: {
                                            effect: 'dark',
                                            content: i.name,
                                            placement: 'top-start'
                                        }
                                    }, [
                                        h('div', {
                                            class: 'lmo_position_relative lmo_hover_theme_color lmo_media-list-item-content lmo_cursor_pointer'
                                        }, [
                                            i.name,
                                            h('div', {
                                                class: 'lmo_select-media-type'
                                            }, [
                                                `${i.type}`
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        );
                    })
                ])
            ])
        );
    },
    props: {
        data: {
            type: Array,
            default: function () {
                return [];
            }
        }
    }
};