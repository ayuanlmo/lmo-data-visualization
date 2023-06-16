export default {
    name: 'lmo-progress',
    props: {
        //百分比
        percentage: {
            type: Number,
            default: 0
        },
        //类型 (可选：line || circle
        type: {
            type: String,
            default: 'line'
        },
        //宽度(px
        strokeWidth: {
            type: Number,
            default: 6
        },
        //进度条显示文字内置在进度条内（只在 type=line 时可用）
        textInside: {
            type: Boolean,
            default: false
        },
        //状态 (可选：success || exception
        status: {
            type: String,
            default: 'success'
        },
        //宽度
        width: {
            type: Number,
            default: 126
        },
        //是否显示进度条文字内容
        showText: {
            type: Boolean,
            default: true
        }
    },
    render(h) {
        return (
                h('el-progress', {
                    props: {
                        percentage: this.percentage,
                        type: this.type,
                        strokeWidth: this.strokeWidth,
                        textInside: this.textInside,
                        status: this.status,
                        width: this.width,
                        showText: this.showText
                    }
                })
        );
    }
};