require('./style.t.scss');

import {mapState} from "vuex";

export default {
    name: 'lmo-audio_config',
    render(h) {
        return (
            h('div', {
                class: 'lmo-audio_config'
            }, [
                h('div', {
                    class: 'lmo-audio_config_left'
                }, [
                    h('div', {
                        class: 'lmo-audio_config_left_audio_box'
                    }, [
                        h('div', {
                            class: 'lmo-audio_config_left_audio_bg_box'
                        }, [
                            h('div', {
                                class: 'lmo-audio_box_label'
                            }, ['背景音乐:']),
                            h('div', {
                                class: 'lmo-audio_content lmo_cursor_pointer',
                                on: {
                                    click: this.selectAudio
                                }
                            }, [
                                h('div', {
                                    class: this.audioName === '' ? 'lmo-audio_content_label lmo-audio_content_label_no_audio' : 'lmo-audio_content_label lmo_theme_color'
                                }, [
                                    this.audioName === '' ? '暂无音频' : this.audioName
                                ]),
                                h('div', {
                                    class: 'lmo-audio_content_icon'
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
                            class: 'lmo-audio_config_left_audio_controller'
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
                }, [])
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
            audioVolume: 100
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
                this.$refs.audio.play();
            }
        },
        pause() {
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