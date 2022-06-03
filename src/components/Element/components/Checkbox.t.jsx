export default {
    name: 'lmo-checkbox',
    props: {
        //是否选中
        checked: {
            type: Boolean,
            default: false
        },
        //文本
        text: {
            type: String,
            default: ''
        },
        //选中状态的值 (仅在 group 下生效)
        label: {
            type: String,
            default: ''
        },
        //是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        //原生name属性
        name: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            select: this.checked
        };
    },
    render(h) {
        return (
                h('el-checkbox', {
                    props: {
                        label: this.label,
                        disabled: this.disabled,
                        name: this.name,
                        value: this.select
                    },
                    on: {
                        change: e => {
                            this.select = e;
                            this.$emit('change', e);
                        }
                    }
                }, [this.text])
        );
    }
};