require('./style.t.scss');

export default {
    name: 'lmo-template_item',
    props: {
        data: {
            type: Object
        }
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-template_item_content',
                on: {
                    click: () => {
                        this.$emit('click', this.data);
                    }
                }
            }, [
                h('div', {
                    class: 'lmo-template_item_content_card'
                }, [
                    h('div', {
                        class: 'lmo-template_item_content_img_box'
                    }, [
                        h('div', {
                            class: 'lmo-template_item_content_img'
                        }, [
                            h('img', {
                                attrs: {
                                    src: `/server${this.data.cover}`
                                }
                            })
                        ]),
                        h('div', {
                            class: 'lmo-template_item_content_title'
                        }, [
                            h('div', {
                                class: 'lmo-template_item_content_title_box'
                            }, [
                                h('div', {
                                    class: 'lmo-template_item_title'
                                }, [this.data.title]),
                                h('div', {
                                    class: ''
                                }, [this.data.description])
                            ])
                        ])
                    ])
                ])
            ])
        );
    }
};