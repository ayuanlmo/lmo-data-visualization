export default {
    name: 'lmo-video_player',
    render(h) {
        return (
            <el-dialog before-close={() => {
                this.visible = false;
            }} width={'34vw'} style={'margin-top: 15vh;z-index: 10;'} title={'lmo_Video_Player'} visible={this.visible}>
                <video ref={'video'} controls style={'width: 32vw;height: 18vw;'} src={'/server' + this.path}/>
            </el-dialog>
        );
    },
    data() {
        return {
            visible: false
        };
    },
    props: {
        path: {
            type: String,
            default: ''
        }
    },
    watch: {
        path() {
            this.visible = true;
        },
        visible(n) {
            if (!n)
                this.$refs.video.pause();
            else
                setTimeout(async () => {
                    this.$refs.video.play();
                }, 500);
        }
    },
    methods: {
        show() {
            this.visible = true;
        }
    }
};