export default {
    name: 'lmo-alert',
    props: {
        title: {
            type: String,
            default: ''
        },
        //类型(可选：success || warning || info || error
        type: {
            type: String,
            default: 'info'
        },
        //辅助文字
        description: {
            type: String
        },
        //可关闭
        closable: {
            type: Boolean,
            default: true
        },
        //文字居中
        center: {
            type: Boolean,
            default: true
        },
        //关闭按钮文本
        closeText: {
            type: String
        },
        //显示图标
        showIcon: {
            type: Boolean,
            default: false
        }
    },
    render(h) {
        return (
                h('el-alert', {
                    props: {
                        title: this.title,
                        type: this.type,
                        description: this.description,
                        closable: this.closable,
                        center: this.center,
                        closeText: this.closeText,
                        showIcon: this.showIcon
                    },
                    on: {
                        close: () => {
                            this.$emit('close');
                        }
                    }
                })
        );
    }
};