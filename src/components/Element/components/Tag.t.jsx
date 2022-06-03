export default {
    name: 'lmo-tag',
    props: {
        //类型
        type: {
            type: String,
            default: 'success'// success || info || warning || danger
        },
        //可否关闭
        closable: {
            type: Boolean,
            default: false
        },
        //背景色
        color: {
            type: String
        },
        //文本
        text: {
            type: String,
            default: ''
        }
    },
    render(h) {
        return (
            h('el-tag', {
                props: {
                    type: this.type,
                    closable: this.closable,
                    color: this.color
                }
            }, [this.text])
        );
    }
};