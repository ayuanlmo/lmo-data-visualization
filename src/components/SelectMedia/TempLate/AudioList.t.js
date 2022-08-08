export default {
    name: 'lmo-audio-list',
    render(h) {
        return (
            h('div', {
                class: 'lmo_audio-list'
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
                                    class: 'lmo_audio-list-item',
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
                                            class: 'lmo_audio-list-item-content lmo_cursor_pointer'
                                        }, [
                                            i.name
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