require('./style.t.scss');

import VideoPlayer from '@/components/VideoPlayer/index.t';

export default {
    name: 'lmo-view_resource',
    render(h) {
        return (
            <div>
                {
                    h(VideoPlayer, {
                        ref: 'VideoPlayer',
                        props: {
                            path: this.playerUrl
                        }
                    })
                }
                <el-dialog before-close={() => {
                    this.visible = false;
                }} width={'40vw'} title={'资源库'} visible={this.visible}>
                    {
                        h('div', {
                            class: 'lmo-view_resource'
                        }, [
                            this.list.length === 0 ?
                                h('el-empty', {
                                    props: {
                                        description: '这里啥也没有'
                                    }
                                }) : h('el-row', [
                                    this.list.map(i => {
                                        return (
                                            h('el-col', {
                                                props: {
                                                    span: 6
                                                }
                                            }, [
                                                h('div', {
                                                    class: 'lmo-view_resource_media_item lmo_cursor_pointer',
                                                    on: {
                                                        click: () => {
                                                            this.playerUrl = i.path;
                                                            this.$refs.VideoPlayer.show();
                                                        }
                                                    }
                                                }, [i.name])
                                            ])
                                        );
                                    })
                                ])
                        ])
                    }
                </el-dialog>
            </div>
        );
    },
    data() {
        return {
            visible: false,
            list: [],
            playerUrl: ''
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        show() {
            this.visible = !this.visible;
        },
        getList() {
            this.$store.dispatch('GET_MEDIA').then(res => {
                this.list = res.data.list;
            }).catch(e => {
                console.log(e);
            });
        }
    },
    watch: {
        visible(n) {
            if (n)
                this.getList();
        }
    }
};