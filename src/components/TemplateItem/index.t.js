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
                        this.showDescription = false;
                    }
                }
            }, [
                h('div', {
                    class: 'lmo-template_item_content_card lmo_position_relative'
                }, [
                    h('div', {
                        class: 'lmo-template_item_content_img_box lmo_position_absolute',
                        on: {
                            mouseover: () => {
                                this.showDescription = true;
                            },
                            mouseout: () => {
                                this.showDescription = false;
                            }
                        }
                    }, [
                        h('div', {
                            class: this.getDescriptionClass
                        }, [
                            h('span', {
                                class: 'lmo-template_description_title animated fadeInDown'
                            }, [
                                this.data.title,
                                this.getEditTemplate()
                            ]),
                            h('br'),
                            h('span', {
                                class: 'lmo-template_description_content animated fadeInDown'
                            }, [this.data.description])
                        ]),
                        h('div', {
                            class: 'lmo-template_item_content_img lmo_position_absolute'
                        }, [
                            h('img', {
                                attrs: {
                                    alt: this.data.cover,
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
                                }, [this.data.title])
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
    },
    data() {
        return {
            showDescription: false
        };
    },
    computed: {
        getDescriptionClass() {
            const _ = 'lmo-template_item_content_img lmo-template_item_content_description lmo_position_absolute';

            return this.showDescription ? `${_}` : `${_} lmo_hide`;
        }
    },
    methods: {
        getEditTemplate(h = this.$createElement) {
            if (this.data.type === 'customize') {
                return h('i', {
                    class: 'el-icon-edit-outline lmo_hover_theme_color',
                    on: {
                        click: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    }
                });
            }
            return '';
        }
    }
};