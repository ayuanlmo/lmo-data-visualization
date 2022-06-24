export default {
    name: 'lmo-input',
    props: {
        //占位符 (支持i18n)
        placeholder: {
            type: String,
            default: () => {
                return '';
            }
        },
        //大小
        size: {
            type: String,
            default: 'mini'
        },
        //类型
        type: {
            type: String,
            default: 'text' //text || textarea
        },
        //绑定值
        value: {
            type: String,
            default: ''
        },
        //是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        //国际化
        i18n: {
            type: Boolean,
            default: false
        },
        //最大长度
        maxLength: {
            type: Number
        },
        //最小长度
        minLength: {
            type: Number
        },
        //可清空
        clearable: {
            type: Boolean,
            default: true
        },
        //头部icon
        prefixIcon: {
            type: String
        },
        //尾部icon
        suffixIcon: {
            type: String
        },
        //输入框行数
        rows: {
            type: Number
        },
        //原生属性：只读
        readonly: {
            type: Boolean,
            default: false
        }
    },
    render(h) {
        return (
            h('el-input', {
                props: {
                    type: this.type,
                    value: this.value,
                    disabled: this.disabled,
                    maxlength: this.maxLength,
                    minlength: this.minLength,
                    clearable: this.clearable,
                    prefixIcon: this.prefixIcon,
                    suffixIcon: this.suffixIcon,
                    rows: this.rows,
                    readonly: this.readonly,
                    size: this.size
                },
                attrs: {
                    placeholder: this.i18n ? this['$t'](this.placeholder) : this.placeholder
                },
                on: {
                    input: e => {
                        this.$emit('change', e);
                    },
                    change: e => {
                        this.$emit('change', e);
                    },
                    blur: e => {
                        this.$emit('blur', e);
                    },
                    focus: e => {
                        this.$emit('focus', e);
                    }
                },
                ref: 'input'
            })
        );
    },
    methods: {
        focus() {
            this.$refs.input['focus']();
        }
    }
};