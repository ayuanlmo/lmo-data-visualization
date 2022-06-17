require('./style.t.scss');

import {mapState} from "vuex";
import {PostMessage} from "@lib/PostMessage/index.t";
import {PREVIEW} from '@/const/MessageType.t';

let timer = 0;

let cont = 0;

export default {
    name: 'lmo-preview',
    render(h) {
        return (
            <el-dialog style={{
                'background-color': '#f5f5f5'
            }} title={'预览'} visible={this.visible} width={'1000px'}
                       fullscreen={false} top={'5vh'} before-close={() => {
                this.visible = false;
            }}>
                {
                    h('div', {
                        class: 'lmo-preview'
                    }, [
                        h('div', {
                            class: [
                                {
                                    'lmo-preview_mask': true,
                                    'lmo_hide': this.playState,
                                    'lmo_position_absolute': true
                                }
                            ]
                        }, [
                            h('p', [
                                h('img', {
                                    class: 'lmo_cursor_pointer',
                                    attrs: {
                                        src: require('@static/svg/play.svg')
                                    },
                                    on: {
                                        click: () => {
                                            postMessage({
                                                type: 'Play',
                                                data: {}
                                            });
                                            this.play();
                                        }
                                    }
                                })
                            ])
                        ]),
                        h('div', {
                            class: 'lmo-preview_iframe_box'
                        }, [
                            this.visible ? <iframe onLoad={this.play} src={this.url + '?type=preview'}
                                                   frameBorder="0"/> : '',
                            h('div', {
                                class: 'lmo-preview_progress_box'
                            }, [
                                <el-progress show-text={false} text-inside={true}
                                             percentage={this.percentage}/>
                            ])
                        ])
                    ])
                }
            </el-dialog>
        );
    },
    data() {
        return {
            visible: false,
            percentage: 0,
            playState: false
        };
    },
    methods: {
        play() {
            this.playState = true;
            PostMessage({
                    type: PREVIEW,
                    data: this.currentConfig
                }
            );
            clearInterval(timer);
            const duration = this.currentConfig.duration;

            this.percentage = 0;
            cont = 0;
            timer = setInterval(() => {
                if (cont === duration / 1000) {
                    this.playState = false;
                    clearInterval(timer);
                } else {
                    cont += 1;
                    this.percentage += 100 / duration * 1000;
                }
            }, 1000);
        },
        show() {
            this.visible = !this.visible;
        }
    },
    watch: {
        visible() {
            if (!this.visible) {
                this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_PLAY_STATE', false);
                clearInterval(timer);
            }
        }
    },
    computed: {
        ...mapState({
            url: state => `/server${state.appStore.currentTemplate.url}`,
            currentConfig: state => state.appStore.currentConfig
        })
    }
};