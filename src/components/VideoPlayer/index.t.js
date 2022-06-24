export default {
    name: 'lmo-video_player',
    render(h) {
        return (
            <el-dialog before-close={() => {
                this.visible = false;
            }} width={'34vw'} style={'margin-top: 15vh;z-index: 10;background-color:#ffffff00;'}
                       title={'lmo VideoPlayer'} visible={this.visible}>
                <video muted ref={'video'} onCanplay={() => {
                    if (this.visible)
                        this.$refs.video['play']();
                    this.videoConf.duration = parseInt(this.$refs.video['duration']);
                }} onTimeupdate={() => {
                    this.videoConf.currentTime = this.$refs.video['currentTime'];
                    this.videoConf.percent = parseInt((this.videoConf.currentTime / this.videoConf.duration * 100).toFixed(2)) + 1;
                    this.sliderValue = this.videoConf.percent;
                }} style={'width: 32vw;height: 18vw;'}
                       src={'/server' + this.path}/>
                <div>
                    {
                        h('el-slider', {
                            props: {
                                disabled: true,
                                value: this.sliderValue,
                                max: 100
                            }
                        })
                    }
                </div>
            </el-dialog>
        );
    },
    props: {
        path: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            visible: false,
            sliderValue: 100,
            videoConf: {
                duration: 0,//总时长
                currentTime: 0,//当前已播放时长
                percent: 0
            }
        };
    },
    methods: {
        show() {
            this.visible = true;
        }
    },
    watch: {
        path() {
            this.visible = true;
        },
        visible(n) {
            if (!n)
                this.$refs.video['pause']();
            else
                setTimeout(async () => {
                    this.$refs.video['play']();
                }, 500);
        }
    }
};