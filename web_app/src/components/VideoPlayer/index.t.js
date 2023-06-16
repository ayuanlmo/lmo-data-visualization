export default {
    name: 'lmo-video_player',
    render(h) {
        return <el-dialog center={true} before-close={() => {
            this.visible = false;
        }} width={'50vw'} style={'z-index: 10;background-color:#ffffff00;'}
                          title={'lmo VideoPlayer'} visible={this.visible}>
            <video muted controls ref={'video'} onCanPlay={() => {
                if (this.visible) this.$refs.video['play']();
            }} style={'width: 48vw;height: 27vw;border-radius: 0.5rem;'}
                   src={`${require('@/config/AppConfig').devProxy.http}${this.path}`}/>
        </el-dialog>;
    },
    props: {
        path: {
            type: String, default: ''
        }
    },
    data() {
        return {
            visible: false
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
            if (!n) this.$refs.video['pause'](); else setTimeout(async () => {
                this.$refs.video['play']();
            }, 500);
        }
    }
};