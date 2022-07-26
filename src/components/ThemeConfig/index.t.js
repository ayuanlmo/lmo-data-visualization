import {mapState} from "vuex";
import {PostMessage} from "@lib/PostMessage/index.t";
import {UPDATE_THEME_COLOR} from "@const/MessageType.t";

export default {
    name: 'lmo-theme_config',
    render(h) {
        return (
            h('div', {
                class: 'lmo-color_config_item'
            }, [
                h('div', {
                    class: 'lmo-color_box'
                }, [
                    h('div', {
                        class: 'lmo-color_box_content lmo_flex_box'
                    }, [
                        h('div', {
                            class: 'lmo-color_box_option'
                        }, [
                            this.currentConfigThemeColor.map((i) => {
                                return (
                                    h('div', {
                                        class: 'lmo-theme_item_content lmo_cursor_pointer',
                                        on: {
                                            click: () => {
                                                if (this.themeColorIndex !== i.value) {
                                                    this.themeColorIndex = i.value;
                                                    this.$store.commit('SET_CURRENT_THEME_COLORS', i.colors);
                                                    PostMessage({
                                                        type: UPDATE_THEME_COLOR,
                                                        data: {
                                                            index: this.themeColorIndex,
                                                            colors: i.colors
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }, [
                                        h('div', {
                                            class: [
                                                'lmo-theme_item_box lmo_flex_box',
                                                this.themeColorIndex === i.value ? 'lmo-theme_item_box_activation_border' : 'lmo-theme_item_box_default_border'
                                            ]
                                        }, [
                                            i.colors.map((j) => {
                                                return (
                                                    h('div', {
                                                        style: {
                                                            background: j
                                                        }
                                                    })
                                                );
                                            })
                                        ])
                                    ])
                                );
                            })
                        ])
                    ])
                ])
            ])
        );
    },
    data() {
        return {
            themeColorIndex: '0'
        };
    },
    computed: {
        ...mapState({
            currentConfigThemeColor: state => state.appStore.currentConfig.themeColors ?? []
        })
    }
};