require('./style.t.scss');

import {mapState} from "vuex";
import {UploadAudioTypes} from '@/const/Default.t';

export default {
    name: 'lmo-audio_config',
    render(h) {
        return (
            h('div', {
                class: 'lmo-audio_config lmo_position_relative lmo-data_visualization_config_item_content'
            }, [
                h('div', {
                    class: 'lmo-data_visualization_config_item_card_title'
                }, ['音频配置']),
                h('div', {
                    class: 'lmo-audio_config_left lmo-data_visualization_config_item_card'
                }, [
                    h('div', {
                        class: 'lmo-audio_config_left_audio_box'
                    }, [
                        h('div', {
                            class: 'lmo-audio_config_left_audio_bg_box'
                        }, [
                            h('div', {
                                class: 'lmo-audio_box_label'
                            }, ['背景音乐']),
                            h('div', [
                                h('el-row', [
                                    h('el-col', {
                                        props: {
                                            span: 12
                                        }
                                    }, [
                                        h('div', {
                                            class: 'lmo-audio_content lmo_cursor_pointer lmo_flex_box',
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
                                    h('el-col', {
                                        props: {
                                            span: 12
                                        }
                                    }, [
                                        h('div', {
                                            class: 'lmo_flex_box',
                                            style: 'line-height: 6.5rem;margin-left: 1rem;margin-left:1.5rem;'
                                        }, [
                                            h('div', {
                                                class: 'lmo-audio_box_label'
                                            }, [
                                                h('el-tooltip', {
                                                    props: {
                                                        content: '开启后视频时长 = 音频时长(动画持续时间不受该选项控制)'
                                                    }
                                                }, [
                                                    h('i', {class: 'lmo_cursor_pointer el-icon-warning'})
                                                ]),
                                                '完整的音频'
                                            ]),
                                            h('div', {
                                                class: ''
                                            }, [
                                                h('lmo-switch', {
                                                    props: {
                                                        value: false
                                                    },
                                                    on: {
                                                        change: (e) => {
                                                            this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_COMPLETE', e);
                                                        }
                                                    }
                                                })
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ]),
                        h('div', {
                            class: 'lmo-audio_config_left_audio_controller'
                        }, [
                            h('div', {
                                class: 'lmo-audio_box_label'
                            }, ['音量大小']),
                            h('div', {
                                class: 'lmo-audio_controller_slider'
                            }, [
                                <el-slider v-model={this['audioVolume']} min={0} max={100} onChange={(e) => {
                                    this.sliderChange(e);
                                }}/>
                            ])
                        ])
                    ])
                ]),
                h('div', {
                    class: 'lmo-data_visualization_config_item_card_title'
                }, ['视频配置']),
                h('div', {
                    class: 'lmo-audio_config_right lmo-data_visualization_config_item_card'
                }, [
                    h('div', {
                        class: 'lmo_video_config_right_item'
                    }, [
                        h('div', {
                            class: 'lmo-video_box_label'
                        }, [
                            '合成帧率',
                            h('el-tooltip', {
                                props: {
                                    content: '帧率越高，合成时间越久。'
                                }
                            }, [
                                h('i', {class: 'lmo_cursor_pointer el-icon-warning'})
                            ])
                        ]),
                        h('div', {
                            class: 'lmo-audio_controller_slider'
                        }, [
                            h('div', {
                                class: 'lmo_flex_box'
                            }, [
                                h('div', [
                                    <el-radio-group v-model={this.videoConf.video.fps}>
                                        <el-radio-button label="30"></el-radio-button>
                                        <el-radio-button label="60"></el-radio-button>
                                        <el-radio-button label="90"></el-radio-button>
                                    </el-radio-group>
                                ]),
                                h('el-tooltip', {
                                    props: {
                                        effect: 'dark',
                                        content: '最小支持30帧, 最大支持90帧',
                                        placement: 'top'
                                    }
                                }, [
                                    h('div', {
                                        class: 'lmo_flex_box lmo-customize_option lmo_position_relative'
                                    }, [
                                        h('span', {
                                            class: 'lmo_color_white'
                                        }, ['自定义']),
                                        h('lmo-input', {
                                            props: {
                                                type: 'number',
                                                clearable: false,
                                                value: `${this.videoConf.video.fps}`
                                            },
                                            on: {
                                                change: (e) => {
                                                    if (this.changeInput('30>90', e))
                                                        this.videoConf.video.fps = `${e}`;
                                                    else
                                                        return this.$message.warning('帧率最低支持30帧,最高支持90帧');
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ])
                        ])
                    ]),
                    h('div', {
                        class: 'lmo_video_config_right_item'
                    }, [
                        h('div', {
                            class: 'lmo-video_box_label'
                        }, [
                            '持续时间',
                            h('el-tooltip', {
                                props: {
                                    content: '单位：(秒)'
                                }
                            }, [
                                h('i', {class: 'lmo_cursor_pointer el-icon-warning'})
                            ])
                        ]),
                        h('div', {
                            class: 'lmo-audio_controller_slide'
                        }, [
                            h('div', {
                                class: 'lmo_flex_box'
                            }, [
                                h('div', [
                                    <el-radio-group onChange={(e) => {
                                        this.$store.commit('SET_TEMPLATE_CURRENT_DURATION', e);
                                    }} v-model={this.videoConf.video.duration}>
                                        <el-radio-button label="5"/>
                                        <el-radio-button label="10"/>
                                        <el-radio-button label="20"/>
                                        <el-radio-button label="30"/>
                                        <el-radio-button label="60"/>
                                    </el-radio-group>
                                ]),
                                h('div', {
                                    class: 'lmo_flex_box lmo-customize_option lmo_position_relative'
                                }, [
                                    h('span', {
                                        class: 'lmo_color_white'
                                    }, ['自定义']),
                                    h('lmo-input', {
                                        props: {
                                            type: 'number',
                                            clearable: false,
                                            value: `${this.videoConf.video.duration}`
                                        },
                                        on: {
                                            change: (e) => {
                                                if (this.changeInput('5>600', e))
                                                    this.videoConf.video.duration = `${e}`;
                                                else
                                                    return this.$message.warning('持续时间最高支持600秒(10分钟),最低支持5秒');
                                            }
                                        }
                                    })
                                ])
                            ])
                        ])
                    ]),
                    h('div', {
                        class: 'lmo_video_config_right_item'
                    }, [
                        h('div', {
                            class: 'lmo-video_box_label'
                        }, [
                            '清晰度',
                            h('el-tooltip', {
                                props: {
                                    content: '清晰度越高，效果越好'
                                }
                            }, [
                                h('i', {class: 'lmo_cursor_pointer el-icon-warning'})
                            ])
                        ]),
                        h('div', {
                            class: 'lmo-audio_controller_slide'
                        }, [
                            <el-radio-group v-model={this.videoConf.video.clarity}>
                                <el-radio-button label="1080P"/>
                                <el-radio-button label="2K"/>
                                <el-radio-button label="4K"/>
                            </el-radio-group>
                        ])
                    ])
                ])
            ])
        );
    },
    data() {
        return {
            audioName: '',
            audioVolume: 100,
            audioPlay: false,
            videoConf: {
                audio: {
                    name: '',
                    volume: 100
                },
                video: {
                    fps: '30',
                    duration: '5',
                    clarity: '1080P'
                }
            }
        };
    },
    methods: {
        changeInput(test = '30>90', num = 0) {
            const _ = test.split('>');

            return num >= parseInt(_[0]) && num <= parseInt(_[1]);
        },
        selectAudio() {
            require('@/utils/index').selectFile().then(file => {
                const fr = new FileReader();

                if (!UploadAudioTypes.includes(file.type))
                    return this.$message.warning(`${file.name}是一个不受支持的音频文件`);
                this.audioName = file.name;
                this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_NAME', this.audioName);
                fr.readAsDataURL(file);
                fr.onload = (r) => {
                    const result = r.currentTarget.result;

                    this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_SRC', result);
                    this.$refs.audio.src = result;
                };
            });
        },
        play() {
            if (this.audioName !== '') {
                this.audioPlay = true;
                this.$refs.audio['play']();
            }
        },
        pause() {
            this.audioPlay = false;
            this.$refs.audio['pause']();
        },
        sliderChange(e) {
            const volume = (e / 100).toFixed(1);

            this.$store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_VOLUME', volume);
            this.$refs.audio.volume = volume;
        }
    },
    mounted() {
        this.$store.commit('SET_CURRENT_TEMPLATE_VIDEO_CONFIG', this.videoConf);
    },
    watch: {
        playState(n) {
            if (n)
                this.play();
            else
                this.pause();
        },
        currentConfig: {
            deep: true,
            handler() {
                this.videoConf.video.duration = this.currentConfig.duration / 1000;
            }
        },
        videoConf: {
            deep: true,
            handler() {
                this.$store.commit('SET_CURRENT_TEMPLATE_VIDEO_CONFIG', this.videoConf);
            }
        }
    },
    computed: {
        ...mapState({
            playState: state => state.appStore.templateCurrentAudioConfig.playState,
            currentConfig: state => state.appStore.currentConfig
        })
    }
};