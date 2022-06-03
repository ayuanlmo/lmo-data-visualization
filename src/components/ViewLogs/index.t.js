require('./style.t.scss');

import {mapState} from "vuex";

export default {
    name: 'lmo-view_logs',
    render(h) {
        return (
            <el-dialog before-close={() => {
                this.visible = false;
            }} title={'消息日志'} visible={this.visible}>
                {
                    h('div', {
                        class: 'lmo-view_logs'
                    }, [
                        h('div', {
                            class: 'lmo-view_logs_content'
                        }, [
                            this.serverPushMessage.map(i => {
                                return (
                                    <p>
                                        {i.currentTime}
                                        {i.msg}
                                    </p>
                                );
                            })
                        ])
                    ])
                }
            </el-dialog>
        );
    },
    data() {
        return {
            visible: false
        };
    },
    methods: {
        show() {
            this.visible = !this.visible;
        }
    },
    computed: {
        ...mapState({
            serverPushMessage: state => state.appStore.serverPushMessage
        })
    }
};