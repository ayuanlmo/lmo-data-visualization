export default {
    name: 'lmo-radio',
    props: {
        //绑定值
        value: {
            type: String,
            default: () => {
                return '';
            }
        },
        //是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        //是否带边框
        border: {
            type: Boolean,
            default: false
        },
        //大小 border为true时生效
        size: {
            type: String//可选 medium || small || mini
        },
        //原生name属性
        name: {
            type: String
        }
    },
    data() {
        return {
            radio_value: ''
        };
    },
    created() {
        this.radio_value = this.value;
    },
    render(h) {
        return (
            h('el-radio', {
                props: {
                    value: this.radio_value,
                    disabled: this.disabled,
                    border: this.border
                },
                on: {
                    change: e => {
                        this.$emit('change', e);
                    }
                }
            })
        );
    }
};