require('./style.t.scss');

export default {
    render(h) {
        return (
            h('div', {
                ref: 'playerIframeBox',
                class: 'lmo-data_visualization_edit_preview_player_iframe_box'
            }, [
                h('iframe', {
                    style: this.iframeStyle,
                    attrs: {
                        src: `/server${this.url}`
                    }
                }),
                h('div', {
                    class: 'lmo-data_visualization_edit_preview_mask'
                })
            ])
        );
    },
    created() {
        window.onload = () => {
            this.initPlayerView();
            window.onresize = () => {
                this.initPlayerView();
            };
        };
    },
    methods: {
        //计算iframe高宽 & 缩放比
        initPlayerView(e = this.$refs.playerIframeBox) {
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
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            iframeStyle: {}
        };
    }
};