require('./style.t.scss');

import {createMessageBox, closeLoading} from "@lib/BasicInteraction";

export default {
    render(h) {
        return (
            h('div', {
                ref: 'playerIframeBox',
                class: 'lmo-data_visualization_edit_preview_player_iframe_box lmo_position_relative'
            }, [
                <div class={'lmo-data_visualization_edit_preview_mask lmo_position_absolute'}/>,
                h('iframe', {
                    class: 'lmo_position_absolute',
                    ref: 'iframe',
                    style: this.iframeStyle,
                    attrs: {
                        src: `/server${this.url}`,
                        id: 'lmo-player_iframe_box'
                    },
                    on: {
                        load: () => {
                            this.checkTemplate();
                        }
                    }
                })
            ])
        );
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
    },
    methods: {
        async checkTemplate() {
            const el = this.$refs.iframe.contentWindow.document.body.childNodes[0];

            try {
                if (await el.innerHTML.indexOf('No Found') !== -1) {
                    createMessageBox({
                        type: 'error',
                        title: '模板错误',
                        message: '无法加载该模板，它貌似并不存在'
                    }).then(async () => {
                        await require('@/utils/index').routerPush(this.$router, '/', 'replace');
                        await closeLoading();
                    });
                }
            } catch (e) {
                return e;
            }
        },
        initPlayerView() {
            const e = this.$refs.playerIframeBox ?? document.getElementById('lmo-player_iframe_box');

            if (!e) return;
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
    async mounted() {
        await this.initPlayerView();
        await addEventListener('resize', this.initPlayerView);
    },
    async destroyed() {
        await removeEventListener('resize', this.initPlayerView);
    }
};