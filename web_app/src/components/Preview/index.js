require('./style.t.scss');

import PlayerBar from '@/components/PlayerBar/index.t';
import {mapState} from "vuex";
import {PostMessage} from "@lib/PostMessage/index.t";
import {PREVIEW} from '@/const/MessageType.t';

const AppConfig = require('@/config/AppConfig');

export default {
    name: 'lmo-preview',
    render(h) {
        return (
            <el-dialog center={true} style={{
                'background-color': '#293943'
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
                            style: {
                                width: '960px',
                                height: '580px'
                            }
                        }, [
                            h('div', {
                                class: 'lmo-preview_iframe_box'
                            }, [
                                this.visible ? <iframe onLoad={this.play} src={this.url + '?type=preview'}
                                                       frameBorder="0"/> : ''
                            ])
                        ]),
                        h('div', [
                            this.visible ?
                                h(PlayerBar, {
                                    ref: 'PlayerBar',
                                    style: {
                                        background: '#293943'
                                    },
                                    props: {
                                        duration: this.currentConfig.duration,
                                        controllerButton: false
                                    }
                                }) : h('')
                        ])
                    ])
                }
            </el-dialog>
        );
    },
    data() {
        return {
            visible: false,
            playState: false
        };
    },
    methods: {
        play() {
            this.playState = true;
            this.$refs['PlayerBar'].reset();
            PostMessage({
                    type: PREVIEW,
                    data: this.currentConfig
                }
            );
        },
        show() {
            this.visible = !this.visible;
        }
    },
    watch: {
        visible() {
            if (!this.visible)
                this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_PLAY_STATE', false);
        }
    },
    computed: {
        ...mapState({
            url: state => `${AppConfig.devProxy.http}${state.appStore.currentTemplate.url}`,
            currentConfig: state => state.appStore.currentConfig,
            currentTemplate: state => state.appStore.currentTemplate
        })
    }
};