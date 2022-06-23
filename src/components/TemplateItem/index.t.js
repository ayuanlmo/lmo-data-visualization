require('./style.t.scss');

export default {
    name: 'lmo-template_item',
    render(h) {
        return (
            h('div', {
                class: 'lmo-template_item_content lmo_cursor_pointer',
                on: {
                    click: () => {
                        this.$emit('click', this.data);
                    }
                }
            }, [
                h('div', {
                    class: 'lmo-template_item_content_card lmo_position_relative'
                }, [
                    h('div', {
                        class: 'lmo-template_item_content_img_box lmo_position_absolute'
                    }, [
                        h('div', {
                            class: 'lmo-template_item_content_img lmo_position_absolute'
                        }, [
                            h('img', {
                                attrs: {
                                    src: `/server${this.data.cover}`
                                }
                            })
                        ]),
                        h('div', {
                            class: 'lmo-template_item_content_title lmo_position_absolute'
                        }, [
                            h('div', {
                                class: 'lmo-template_item_content_title_box'
                            }, [
                                h('div', {
                                    class: 'lmo-template_item_title'
                                }, [this.data.title]),
                                h('div', {
                                    class: 'lmo-template_item_dis'
                                }, [this.data.description])
                            ])
                        ])
                    ])
                ])
            ])
        );
    },
    props: {
        data: {
            type: Object
        }
    }
};