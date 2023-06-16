require('./style.t.scss');

import AnimateNames from "@/const/AnimateNames.t";

export default {
    name: 'lmo-animate_list',
    render(h) {
        return (
            <el-dialog center={true} beforeClose={() => {
                this.show();
            }} visible={this.visible} title={'选择标题动画'} width={'40%'}>
                {
                    h('el-collapse', {
                        props: {
                            accordion: true
                        }
                    }, [
                        AnimateNames.map((i) => {
                            return (
                                h('el-collapse-item', {
                                    props: {
                                        title: i.name
                                    }
                                }, [
                                    h('div', {
                                        class: 'lmo-animates_box'
                                    }, [
                                        i.animates.map((j) => {
                                            return (
                                                h('div', {
                                                    class: this.animateName === j ? 'select lmo-animates_box_item' : `lmo-animates_box_item` + ' lmo_cursor_pointer',
                                                    on: {
                                                        click: () => {
                                                            this.animateName = j;
                                                        }
                                                    }
                                                }, [
                                                    h('p', {
                                                        class: `animated ${j} infinite`
                                                    }, [j])
                                                ])
                                            );
                                        })
                                    ])
                                ])
                            );
                        })
                    ])
                }
                {
                    h('span', {
                        slot: 'footer'
                    }, [
                        h('lmo-button', {
                            props: {
                                text: '确定'
                            },
                            on: {
                                click: () => {
                                    this.visible = false;
                                    this.$emit('selectAnimate', this.animateName);
                                }
                            }
                        })
                    ])
                }
            </el-dialog>
        );
    },
    data() {
        return {
            visible: false,
            animateName: ''
        };
    },
    methods: {
        show() {
            this.visible = !this.visible;
        }
    }
};