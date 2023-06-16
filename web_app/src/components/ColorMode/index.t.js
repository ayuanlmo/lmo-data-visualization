import {mapState} from "vuex";

export default {
    render(h) {
        if (this.mode === 'Theme') {
            return (
                h('div', [''])
            );
        }
        if (this.mode === 'Monotone') {
            return (
                h('lmo-color-picker', {
                    props: {
                        value: this.config.Monotone.color
                    },
                    on: {
                        change: (e) => {
                            this.config.Monotone.color = e;
                            this.$emit('change', this.config);
                        }
                    }
                })
            );
        }
        if (this.mode === 'Gradient') {
            return (
                h('div', [
                    h('lmo-color-picker', {
                        props: {
                            value: this.Gradient.color1
                        },
                        on: {
                            change: (e) => {
                                this.config.Gradient.color[0] = e;
                                this.Gradient.color1 = e;
                                this.$emit('change', this.config);
                            }
                        }
                    }),
                    h('i', {
                        class: 'el-icon-arrow-right lmo_color_white',
                        style: {
                            padding: '0 1rem'
                        }
                    }),
                    h('lmo-color-picker', {
                        props: {
                            value: this.Gradient.color2
                        },
                        on: {
                            change: (e) => {
                                this.config.Gradient.color[1] = e;
                                this.Gradient.color2 = e;
                                this.$emit('change', this.config);
                            }
                        }
                    })
                ])
            );
        }
    },
    data() {
        const _ = {
            Monotone: {
                color: '#fff'
            },
            Gradient: {
                color: ['#88D085FF', '#88d085']
            }
        };

        return {
            config: {
                ..._
            },
            Gradient: {
                color1: _.Gradient.color[0],
                color2: _.Gradient.color[1]
            }
        };
    },
    computed: {
        ...mapState({
            mode: state => state.appStore.currentConfig.color['more']['type'],
            themeColor: state => state.appStore.currentConfig.themeColor
        })
    },
    watch: {
        'themeColor': {
            deep: true,
            handler() {
                try {
                    // this.config.Gradient.color[0] = this.modeConfig.Gradient.color[0];
                    // this.config.Gradient.color[1] = this.modeConfig.Gradient.color[1];
                    this.config.Gradient.color[0] = this.themeColor[0];
                    this.config.Gradient.color[1] = this.themeColor[this.themeColor.length - 1];
                    this.Gradient.color1 = this.themeColor[0];
                    this.Gradient.color2 = this.themeColor[this.themeColor.length - 1];
                    this.config.Monotone.color = this.themeColor[0];
                    this.$emit('change', this.config);
                } catch (e) {
                    e;
                }
            }
        }
    }
};