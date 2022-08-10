require('./TempLate/style.t.scss');

import AudioListT from "@components/SelectMedia/TempLate/AudioList.t";
import NoData from '@/components/NoData/index.t';

export default {
    name: 'lmo-select-media',
    render(h) {
        return (
            h('el-dialog', {
                props: {
                    visible: this.showSelectMedia,
                    title: '选择媒体文件',
                    'before-close': () => {
                        this.showSelectMedia = false;
                    }
                }
            }, [
                h('div', {}, [
                    h('lmo-button', {
                        props: {
                            text: '上传'
                        },
                        on: {
                            click: () => {
                                require('@/utils/index').selectFile(false).then(file => {
                                    this.$store.dispatch('UPLOAD_MEDIA', {
                                        media: file
                                    }).then(res => {
                                        if (res.code === 200) {
                                            this.$message.success('上传成功');
                                            this.getMedia();
                                        }
                                    });
                                });
                            }
                        }
                    })
                ]),
                h('el-tabs', {
                    props: {
                        value: this.tabsActiveName
                    },
                    on: {
                        'tab-click': (t) => {
                            this.tabsActiveName = t.name;
                        }
                    }
                }, [
                    this.template.map(i => {
                        if (this.showTab === i.name || this.showTab === '') {
                            return (
                                h('el-tab-pane', {
                                    props: {
                                        label: i.label,
                                        name: i.name
                                    }
                                }, [
                                    this.media[i.dataIndex].length === 0 ? h('div', [
                                        h(NoData)
                                    ]) : h(i.template, {
                                        props: {
                                            data: this.media[i.dataIndex]
                                        },
                                        on: {
                                            click: (e) => {
                                                this.$emit('select', e);
                                                this.show();
                                            }
                                        }
                                    })
                                ])
                            );
                        }
                    })
                ])
            ])
        );
    },
    props: {
        showTab: {
            type: String,
            default: ''
        }
    },
    methods: {
        show() {
            this.showSelectMedia = !this.showSelectMedia;
            if (this.showSelectMedia)
                this.getMedia();
        },
        getMedia() {
            this.$store.dispatch('GET_UPLOAD_MEDIA').then(res => {
                this.media = res.data;
            });
        }
    },
    created() {
        if (this.showTab !== '')
            this.tabsActiveName = this.showTab;
    },
    data() {
        return {
            showSelectMedia: false,
            media: {
                audioMedia: [],
                videoMedia: [],
                imageMedia: []
            },
            tabsActiveName: 'audio',
            template: [
                {
                    label: '音频',
                    name: 'audio',
                    dataIndex: 'audioMedia',
                    template: AudioListT
                },
                {
                    label: '视频',
                    name: 'video',
                    dataIndex: 'videoMedia'
                },
                {
                    label: '图片',
                    name: 'image',
                    dataIndex: 'imageMedia'
                }
            ]
        };
    }
};