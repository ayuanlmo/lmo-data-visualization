require('./style.t.scss');

import VideoPlayer from '@/components/VideoPlayer/index.t';

export default {
    name: 'lmo-view_resource', render(h) {
        return (
            h('div', [
                    h(VideoPlayer, {
                        ref: 'VideoPlayer',
                        props: {
                            path: this.playerUrl
                        }
                    }),
                    <el-dialog before-close={() => {
                        this.visible = false;
                    }} width={'40vw'} title={'资源库'} visible={this['visible']}>
                        {
                            h('div', {
                                    class: 'lmo-view_resource'
                                },
                                [
                                    this.list.length === 0 ?
                                        h('el-empty', {
                                            props: {
                                                description: '这里啥也没有'
                                            }
                                        }) : h('div', {
                                            class: 'lmo-view_resource_list'
                                        }, [
                                            this.list.map(i => {
                                                return (
                                                    h('div', {
                                                        class: 'lmo-resource_item lmo_flex_box lmo_cursor_pointer'
                                                    }, [
                                                        h('div', {
                                                            class: 'lmo-resource_item_title lmo_color_white'
                                                        }, [
                                                            h('span', {
                                                                class: 'lmo-view_resource_media_item_status'
                                                            }, [
                                                                `${i.status === 'Processing' ? '进行中' : '已完成'}`
                                                            ]),
                                                            `${i.name}`
                                                        ]),
                                                        h('div', {
                                                            class: 'lmo-view_resource_media_item_option lmo_flex_box'
                                                        }, [
                                                            h('div', {
                                                                class: 'lmo-view_resource_media_item_option_item'
                                                            }, [
                                                                h('img', {
                                                                    attrs: {
                                                                        src: require('@/assets/svg/view.svg')
                                                                    },
                                                                    on: {
                                                                        click: () => {
                                                                            this.clickEvent(i, 'view');
                                                                        }
                                                                    }
                                                                })
                                                            ]),
                                                            h('div', {
                                                                class: 'lmo-view_resource_media_item_option_item'
                                                            }, [
                                                                h('img', {
                                                                    attrs: {
                                                                        src: require('@/assets/svg/download.svg')
                                                                    },
                                                                    on: {
                                                                        click: () => {
                                                                            this.clickEvent(i, 'download');
                                                                        }
                                                                    }
                                                                })
                                                            ]),
                                                            h('div', {
                                                                class: 'lmo-view_resource_media_item_option_item lmo_hide'
                                                            }, [
                                                                h('img', {
                                                                    attrs: {
                                                                        src: require('@/assets/svg/log.svg')
                                                                    },
                                                                    on: {
                                                                        click: () => {
                                                                            this.clickEvent(i, 'log');
                                                                        }
                                                                    }
                                                                })
                                                            ]),
                                                            h('div', {
                                                                class: 'lmo-view_resource_media_item_option_item'
                                                            }, [
                                                                h('img', {
                                                                    attrs: {
                                                                        src: require('@/assets/svg/del.svg')
                                                                    },
                                                                    on: {
                                                                        click: () => {
                                                                            this.clickEvent(i, 'del');
                                                                        }
                                                                    }
                                                                })
                                                            ])
                                                        ])
                                                    ])
                                                );
                                            })
                                        ])
                                ]
                            )
                        }
                    </el-dialog>
                ]
            )
        );
    },
    data() {
        return {
            visible: false, list: [], playerUrl: '', showOption: false
        };
    },
    methods: {
        show() {
            this.visible = !this.visible;
        },
        getList() {
            this.$store.dispatch('GET_MEDIA').then(res => {
                this.list = res.data.list;
            });
        },
        clickEvent(i = {}, type = '') {
            if (i.status === 'Processing')
                return this.$message.warning('当前任务正在进行中,请稍后进行操作');
            if (type === 'view') {
                this.playerUrl = `/${i.path}`;
                this.$refs.VideoPlayer.show();
            }
            if (type === 'download') {
                require('@/utils/index').downloadFile({
                    download: i.name,
                    href: `${require('@/config/AppConfig').devProxy.http}/${i.path}`
                }).then(a => {
                    a.click();
                });
            }
            if (type === 'del') {
                this.$confirm('将永久删除该文件以及日志，确定吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('DEL_MEDIA_ITEM', {
                        id: i.id,
                        path: i.path
                    }).then(r => {
                        if (r.code === 200) {
                            this.$message.success('删除成功');
                            this.getList();
                        }
                    });
                }).catch(() => {
                });
            }
        }
    },
    mounted() {
        this.getList();
    },
    watch: {
        visible(n) {
            if (n) this.getList();
        }
    }
};