require('./index.t.scss');

import JSON_VIEW from 'vue-json-views';
import {mapState} from "vuex";

export default {
    name: 'lmo-preview_template_conf',
    render(h) {
        return (
            h('el-drawer', {
                props: {
                    direction: 'rtl',
                    visible: this.visible,
                    withHeader: false
                },
                on: {
                    close: (close) => {
                        this.visible = false;
                    }
                }
            }, [
                h('div', {
                    class: 'lmo-preview_template_conf'
                }, [
                    h('div', {
                        class: 'lmo-preview_template_conf_title'
                    }, ['Hi, there 👋']),
                    h('div', {
                        class: 'lmo-preview_template_conf_preview_type_box'
                    }, [
                        h('span', ['预览方式：']),
                        <el-radio v-model={this.previewType} label="JSON">JSON</el-radio>,
                        <el-radio v-model={this.previewType} label="text">文本</el-radio>,
                        h('div', [
                            h(JSON_VIEW, {
                                class: this.previewType === 'JSON' ? '' : 'lmo_hide',
                                props: {
                                    data: this.currentConfig,
                                    deep: 3
                                }
                            }),
                            <el-input rows={50} class={this.previewType === 'text' ? '' : 'lmo_hide'} type={'textarea'}
                                      value={JSON.stringify(this.currentConfig)}/>
                        ])
                    ])
                ])
            ])
        );
    },
    data() {
        return {
            previewType: 'JSON',
            visible: false
        };
    },
    methods: {
        show() {
            this.visible = !this.visible;
        }
    },
    computed: {
        ...mapState({
            currentConfig: state => state.appStore.currentConfig
        })
    }
};