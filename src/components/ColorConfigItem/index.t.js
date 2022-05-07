require('./style.t.scss');

import {mapState} from "vuex";

export default {
    name: 'lmo-color_config_item',
    computed: {
        ...mapState({
            currentConfigColor: state => state.appStore.currentConfig.config.text
        })
    },
    data() {
        return {
            configColor: {},
            configColorTemplate: null,
            h: null
        };
    },
    render(h) {
        this.h = h;
        console.log(this.configColor);
        return (
            h('div', {
                class: 'lmo-color_config_item'
            }, [
                this.configColorTemplate
            ])
        );
    },
    methods: {
        initConfigColor() {
            Object.keys(this.currentConfigColor).map((i) => {
                this.configColor[i] = this.currentConfigColor[i];
            });
            this.initConfigColorTemplate();
            console.log(this.configColor);
        },
        initConfigColorTemplate(h = this.h) {
            this.configColorTemplate = [];

            Object.keys(this.configColor).map(i => {
                this.configColorTemplate.push(
                    h('div', {
                        class: 'lmo-color_box'
                    }, [
                        h('div', {
                            class: 'lmo-color_box_content'
                        }, [
                            h('div', {
                                class: 'lmo-color_box_label'
                            }, [`${this.configColor[i].label}颜色:`]),
                            h('div', {
                                class: 'lmo-color_box_option'
                            }, [
                                h('el-color-picker', {
                                    props: {
                                        value: this.configColor[i].color
                                    },
                                    on: {
                                        'active-change': (e) => {
                                            this.configColor[i].color = e;
                                            this.$store.commit('SET_CURRENT_TEMPLATE_TEXT_SETTING', this.configColor);
                                        }
                                    }
                                })
                            ])
                        ])
                    ])
                );
            });
        }
    },
    watch: {
        currentConfigColor: {
            deep: true,
            handler() {
                this.initConfigColor();
            }
        }
    }
};