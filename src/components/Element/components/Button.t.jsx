export default {
    name: 'lmo-button',
    props: {
        //类型
        type: {
            type: String,
            default: 'primary'//primary || success || warning || danger || info || text
        },
        //文本
        text: {
            // type: String,
            // default: ''
        },
        //是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        //原生type
        nativeType: {
            type: String,
            default: ''//button || submit ||reset
        },
        //图标类名
        iconClass: {
            type: String,
            default: ''
        },
        //是否加载
        loading: {
            type: Boolean,
            default: false
        },
        //是否圆形按钮
        round: {
            type: Boolean,
            default: false
        },
        //朴素按钮
        plain: {
            type: Boolean,
            default: false
        },
        //大小
        size: {
            type: String,
            default: 'mini'
        }
    },
    render(h) {
        return (
                h('el-button', {
                    props: {
                        type: this.type,
                        disabled: this.disabled,
                        nativeType: this.nativeType,
                        icon: this.iconClass,
                        loading: this.loading,
                        round: this.round,
                        plain: this.plain,
                        size: this.size
                    },
                    on: {
                        click: e => {
                            this.$emit('click', e);
                        }
                    }
                }, [this.text], h(this.$slots.default))
        );
    }
};