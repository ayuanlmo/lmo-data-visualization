require('./style.t.scss');

export default {
    name: 'lmo-template_item',
    render(h) {
        return (
            h('div', {
                class: 'lmo-template_item_content',
                on: {
                    click: () => {
                        this.$router.push('/edit');
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
                                    src: require('../../assets/background.jpg')
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
                                }, ['多柱状图']),
                                h('div', {
                                    class: ''
                                }, ['适用于多数据对比分析'])
                            ])

                        ])
                    ])
                ])
            ])
        );
    }
};