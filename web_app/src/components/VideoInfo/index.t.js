require('./style.t.scss');

import {mapState} from "vuex";

export default {
    name: 'lmo-video-info',
    render(h) {
        return (
            h('div', {
                class: 'lmo-video-info'
            }, [
                h('div', {
                    class: 'lmo-video-info-content lmo_color_white'
                }, [
                    h('div', [
                        `视频信息：${this.videoInf}`
                    ]),
                    h('div', [
                        `音频信息：${this.audioInf}`
                    ])
                ])
            ])
        );
    },
    data() {
        return {
            videoInf: '',
            audioInf: ''
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
        });
    },
    methods: {
        init() {
            this.videoInf = `模板：${this.currentTemplate.title}、总时长：${this.currentTemplateVideoConfig.video.duration}s、帧率：${this.currentTemplateVideoConfig.video.fps}fps、清晰度：${this.currentTemplateVideoConfig.video.clarity}`;
            this.audioInf = `名称：${this.templateCurrentAudioConfig.src === '' ? '暂无' : this.templateCurrentAudioConfig.src.split('/static/uploads/')[1]}、音量：${this.templateCurrentAudioConfig.volume * 100}%、完整：${this.templateCurrentAudioConfig.complete ? '是' : '否'}`;
        }
    },
    computed: {
        ...mapState({
            templateCurrentAudioConfig: state => state.appStore.templateCurrentAudioConfig,
            currentTemplate: state => state.appStore.currentTemplate,
            currentTemplateVideoConfig: state => state.appStore.currentTemplateVideoConfig
        })
    },
    watch: {
        currentTemplate: {
            deep: !![],
            handler() {
                this.init();
            }
        },
        templateCurrentAudioConfig: {
            deep: !![],
            handler() {
                this.init();
            }
        },
        currentTemplateVideoConfig: {
            deep: !![],
            handler() {
                this.init();
            }
        }
    }
};