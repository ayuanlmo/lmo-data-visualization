require('./style.t.scss');

import {mapState} from 'vuex';
import ThemeConfigItem from '@/components/ColorConfigItem/index.t';

export default {
    name: 'lmo-config_item',
    render(h) {
        return (
            this.renderTemplate
        );
    },
    data() {
        return {
            configText: {},
            renderTemplate: null
        };
    },
    methods: {
        initRender(h = this.$createElement) {
            this.renderTemplate = h('div', {
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
                                class: 'lmo-text_content lmo_flex_box'
                            }, [
                                h('div', {
                                    class: 'lmo-text_box_label'
                                }, [
                                    h('span', [`${this.configText[i].label}:`])
                                ]),
                                h('div', {
                                    class: 'lmo-text_box_option'
                                }, [
                                    h('div', {
                                        class: 'lmo-text_box_option_lmo-component'
                                    }, [
                                        this.renderComponent(i, h)
                                    ])
                                ])
                            ])

                        ])
                    );
                })
            ]), h('div', {
                class: 'lmo-data_visualization_config_item_card theme'
            }, [h(ThemeConfigItem)])
            ]);
        },
        initConfigText() {
            Object.keys(this.currentConfigText).map((i) => {
                this.configText[i] = this.currentConfigText[i];
            });
            this.initRender();
        },
        renderComponent(i, h) {
            const _component = this.configText[i].type;

            if (_component === 'lmo-input') {
                return h(_component, {
                    props: {
                        value: this.configText[i].value
                    },
                    on: {
                        blur: () => {
                            this.emitConfig();
                        },
                        change: e => {
                            this.configText[i].value = e;
                        }
                    }
                });
            }
            if (_component === 'lmo-switch') {
                return h(_component, {
                    props: {
                        value: this.configText[i].value
                    },
                    on: {
                        change: (e) => {
                            this.configText[i].value = e;
                            this.emitConfig();
                        }
                    }
                });
            }
            if (_component === 'lmo-input-number') {
                return h(_component, {
                    props: {
                        value: this.configText[i].value
                    },
                    on: {
                        change: (e) => {
                            this.configText[i].value = e;
                            this.emitConfig();
                        }
                    }
                });
            }
        },
        emitConfig() {
            this.$store.commit('SET_CURRENT_TEMPLATE_TEXT_SETTING', this.configText);
        }
    },
    watch: {
        currentConfigText: {
            deep: true,
            handler() {
                this.initConfigText();
            }
        }
    },
    computed: {
        ...mapState({
            currentConfigText: state => state.appStore.currentConfig.text
        })
    }
};