require('./style.t.scss');

export default {
    render(h) {
        return (
            h('div', {
                ref: 'playerIframeBox',
                class: 'lmo-data_visualization_edit_preview_player_iframe_box lmo_position_relative'
            }, [
                <div v-loading={this.iframeLoading}
                     class={'lmo-data_visualization_edit_preview_mask lmo_position_absolute'}/>,
                h('iframe', {
                    class: 'lmo_position_absolute',
                    style: this.iframeStyle,
                    attrs: {
                        src: `/server${this.url}`,
                        id: 'lmo-player_iframe_box'
                    },
                    on: {
                        load: () => this.iframeLoading = false
                    }
                })
            ])
        );
    },
    props: {
        url: {
            type: String,
            default: '',
            iframeLoading: true
        }
    },
    data() {
        return {
            iframeStyle: {}
        };
    },
    methods: {
        //计算iframe高宽 & 缩放比
        initPlayerView(e = this.$refs.playerIframeBox ?? document.getElementById('lmo-player_iframe_box')) {
            const _domHeight = e.offsetHeight;
            const _domWidth = e.offsetWidth;

            let _s = 0;

            if (_domWidth / 1920 > _domWidth / 1080)
                _s = _domHeight / 1080;
            else
                _s = _domWidth / 1920;

            this.iframeStyle = {
                transform: `scale( ${_s} )`,
                width: _domWidth,
                height: _domHeight
            };
        }
    },
    mounted() {
        setTimeout(async () => {
            await this.initPlayerView();
        }, 200);
        addEventListener('resize', () => {
            this.initPlayerView();
        });
        onresize = () => {
            this.initPlayerView();
        };
    },
    destroyed() {
        onresize = null;
    }
};