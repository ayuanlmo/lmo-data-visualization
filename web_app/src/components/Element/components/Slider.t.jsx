export default {
    name: 'lmo-slider',
    props: {
        //绑定值
        value: {
            type: Number,
            default: 10
        },
        //最小值
        min: {
            type: Number,
            default: 0
        },
        //最大值
        max: {
            type: Number,
            default: 100
        },
        //禁用
        disabled: {
            type: Boolean,
            default: false
        },
        //步长
        step: {
            type: Number,
            default: 1
        },
        //是都显示输入框(仅再非范围选择时生效
        showInput: {
            type: Boolean,
            default: false
        },
        //在显示输入框的情况下，是否显示输入框的控制按钮
        showInputControls: {
            type: Boolean,
            default: true
        },
        //时间断点
        showStops: {
            type: Boolean,
            default: false
        },
        //显示Tooltip
        showTooltip: {
            type: Boolean,
            default: true
        },
        //范围选择
        range: {
            type: Boolean,
            default: false
        },
        //竖向模式
        vertical: {
            type: Boolean,
            default: false
        },
        //高度(vertical为真时必填
        height: {
            type: String,
            default: '300'
        },
        //阅读器标签
        label: {
            type: String
        },
        //去抖延迟(showInput为真时生效
        debounce: {
            type: Number,
            default: 300
        }
    },
    render(h) {
        return (
                h('el-slider', {
                    props: {
                        value: this.value,
                        min: this.min,
                        max: this.max,
                        disabled: this.disabled,
                        step: this.step,
                        showInput: this.showInput,
                        showInputControls: this.showInputControls,
                        showStops: this.showStops,
                        showTooltip: this.showTooltip,
                        range: this.range,
                        vertical: this.vertical,
                        height: this.height,
                        label: this.label,
                        debounce: this.debounce
                    },
                    on: {
                        change: (e) => {
                            this.$emit('change', e);
                        }
                    }
                })
        );
    }
};