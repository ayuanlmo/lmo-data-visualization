require('./style.t.scss');

import {mapState} from "vuex";

export default {
    name: 'lmo-audio_config',
    render(h) {
        return (
            h('div', {
                class: 'lmo-audio_config lmo_flex_box'
            }, [
                h('div', {
                    class: 'lmo-audio_config_left'
                }, [
                    h('div', {
                        class: 'lmo-audio_config_left_audio_box'
                    }, [
                        h('div', {
                            class: 'lmo-audio_config_left_audio_bg_box lmo_flex_box'
                        }, [
                            h('div', {
                                class: 'lmo-audio_box_label'
                            }, ['背景音乐:']),
                            h('div', {
                                class: 'lmo-audio_content lmo_cursor_pointer',
                                on: {
                                    click: this.selectAudio,
                                    mouseover: this.play,
                                    mouseout: this.pause
                                }
                            }, [
                                h('div', {
                                    class: this.audioName === '' ? 'lmo-audio_content_label lmo-audio_content_label_no_audio' : 'lmo-audio_content_label lmo_theme_color'
                                }, [
                                    this.audioName === '' ? '暂无音频' : this.audioName
                                ]),
                                h('div', {
                                    class: this.audioPlay ? 'lmo-audio_content_icon animated flash infinite' : 'lmo-audio_content_icon'
                                }, [
                                    h('img', {
                                        attrs: {
                                            src: require('@/assets/svg/audio.svg')
                                        }
                                    }),
                                    h('audio', {ref: 'audio'})
                                ])
                            ])
                        ]),
                        h('div', {
                            class: 'lmo-audio_config_left_audio_controller lmo_flex_box'
                        }, [
                            h('div', {
                                class: 'lmo-audio_box_label'
                            }, ['音量大小:']),
                            h('div', {
                                class: 'lmo-audio_controller_slider'
                            }, [
                                <el-slider v-model={this.audioVolume} min={0} max={100} onChange={(e) => {
                                    this.sliderChange(e);
                                }}/>
                            ])
                        ])
                    ])


                ]),
                h('div', {
                    class: 'lmo-audio_config_right'
                }, [
                    h('div', {
                        class: 'lmo_video_config_right_item lmo_flex_box'
                    }, [
                        h('div', {
                            class: 'lmo-video_box_label'
                        }, [
                            h('el-tooltip', {
                                props: {
                                    content: '帧率越高，合成时间越久。'
                                }
                            }, [
                                h('i', {class: 'lmo_cursor_pointer el-icon-warning'})
                            ]),
                            '合成帧率:'
                        ]),
                        h('div', {
                            class: 'lmo-audio_controller_slide'
                        }, [
                            <el-radio-group v-model={this.videoConf.video.fps}>
                                <el-radio-button label="30"></el-radio-button>
                                <el-radio-button label="60"></el-radio-button>
                                <el-radio-button label="90"></el-radio-button>
                            </el-radio-group>
                        ])
                    ]),
                    h('div', {
                        class: 'lmo_video_config_right_item lmo_flex_box'
                    }, [
                        h('div', {
                            class: 'lmo-video_box_label'
                        }, [
                            h('el-tooltip', {
                                props: {
                                    content: '单位：(秒)'
                                }
                            }, [
                                h('i', {class: 'lmo_cursor_pointer el-icon-warning'})
                            ]),
                            '持续时间:'
                        ]),
                        h('div', {
                            class: 'lmo-audio_controller_slide'
                        }, [
                            <el-radio-group onChange={(e) => {
                                console.log('变化', e);
                            }} v-model={this.videoConf.video.duration}>
                                <el-radio-button label="5"></el-radio-button>
                                <el-radio-button label="10"></el-radio-button>
                                <el-radio-button label="20"></el-radio-button>
                                <el-radio-button label="30"></el-radio-button>
                                <el-radio-button label="60"></el-radio-button>
                            </el-radio-group>
                        ])
                    ])
                ])
            ])
        );
    },
    computed: {
        ...mapState({
            playState: state => state.appStore.templateCurrentAudioConfig.playState
        })
    },
    data() {
        return {
            audioName: '',
            audioVolume: 100,
            audioPlay: false,
            videoConf: {
                audio: {
                    name: this.audioName,
                    volume: (this.audioVolume / 100).toFixed(1)
                },
                video: {
                    fps: '30',
                    duration: 5
                }
            }
        };
    },
    methods: {
        selectAudio() {
            const i = document.createElement('input');

            i.type = 'file';
            i.addEventListener('change', () => {
                const file = i.files[0];
                const fr = new FileReader();

                this.audioName = file.name;
                this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_NAME', this.audioName);

                fr.readAsDataURL(file);
                fr.onload = (r) => {
                    const result = r.currentTarget.result;

                    this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_SRC', result);
                    this.$refs.audio.src = result;
                };
            });
            i.click();
        },
        play() {
            if (this.audioName !== '') {
                this.audioPlay = true;
                this.$refs.audio.play();
            }
        },
        pause() {
            this.audioPlay = false;
            this.$refs.audio.pause();
        },
        sliderChange(e) {
            const volume = (e / 100).toFixed(1);

            this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_VOLUME', volume);
            this.$refs.audio.volume = (e / 100).toFixed(1);
        }
    },
    watch: {
        playState(n) {
            if (n)
                this.play();
            else
                this.pause();
        }
    }
};