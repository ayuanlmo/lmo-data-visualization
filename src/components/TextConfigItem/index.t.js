require('./style.t.scss');

import {mapState} from 'vuex';

export default {
    name: 'lmo-config_item', computed: {
        ...mapState({
            currentConfigText: state => state.appStore.currentConfig.config.text
        })
    },
    watch: {
        currentConfigText: {
            deep: true,
            handler() {
                this.initConfigText();
            }
        }
    },
    render(h) {
        console.log(this.currentConfigText);
        return (
            h('div', {
                class: 'lmo-data_visualization_config_item'
            }, [h('div', {
                class: 'lmo-data_visualization_config_item_card text'
            }, [
                Object.keys(this.configText).map(i => {
                    return (
                        h('div', {
                            class: 'lmo-text_box'
                        }, [
                            h('div', {
                                class: 'lmo-text_content'
                            }, [
                                h('div', {
                                    class: 'lmo-text_box_label'
                                }, [
                                    h('span', [`${this.configText[i].label}:`])
                                ]),
                                h('div', {
                                    class: 'lmo-text_box_option'
                                }, [
                                    h('lmo-input', {
                                        props: {
                                            value: this.configText[i].value
                                        },
                                        on: {
                                            blur: () => {
                                                this.$store.commit('SET_CURRENT_TEMPLATE_TEXT_SETTING', this.configText);
                                            },
                                            change: e => {
                                                this.configText[i].value = e;
                                            }
                                        }
                                    })
                                ])
                            ])

                        ])
                    );
                })
            ]), h('div', {
                class: 'lmo-data_visualization_config_item_card theme'
            })])
        );
    },
    data() {
        return {
            configText: {}
        };
    },
    methods: {
        initConfigText() {
            Object.keys(this.currentConfigText).map((i) => {
                this.configText[i] = this.currentConfigText[i];
            });
        }
    }
};