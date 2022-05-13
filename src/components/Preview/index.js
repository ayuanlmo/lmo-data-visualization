require('./style.t.scss');

import {mapState} from "vuex";

let timer = 0;

let cont = 0;

export default {
    name: 'lmo-preview',
    computed: {
        ...mapState({
            url: state => state.appStore.currentTemplate.url
        })
    },
    render(h) {
        return (
            <el-dialog style={'background-color: #f5f5f5;'} title={'预览'} visible={this.visible} width={'1000px'}
                       fullscreen={false} top={'5vh'} before-close={() => {
                this.visible = false;
            }}>
                {
                    h('div', {
                        class: 'lmo-preview'
                    }, [
                        h('div', {
                            class: 'lmo-preview_iframe_box'
                        }, [
                            this.visible ? <iframe onLoad={this.play} src={this.url} frameBorder="0"></iframe> : '',
                            h('div', {
                                class: 'lmo-preview_progress_box'
                            }, [
                                <el-progress show-text={false} text-inside={true}
                                             percentage={this.percentage}></el-progress>
                            ])
                        ])
                    ])
                }
            </el-dialog>
        );
    },
    methods: {
        play() {
            const duration = this.$store.state.appStore.currentConfig.duration;
            const _ = duration / 1000;

            this.percentage = 0;

            timer = setInterval(() => {
                if (cont === _)
                    clearInterval(timer);
                else {
                    cont += 1;
                    this.percentage += 100 / duration * 1000;
                }
            }, 1000);
        },
        show() {
            this.visible = !this.visible;
        }
    },
    data() {
        return {
            visible: true,
            percentage: 0
        };
    }
};