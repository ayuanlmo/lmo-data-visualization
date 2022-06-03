export default {
    name: 'lmo-switch',
    props: {
        //打开时颜色
        activeColor: {
            type: String,
            default: ''
        },
        //关闭时颜色
        inactiveColor: {
            type: String,
            default: ''
        },
        //绑定值
        value: {
            type: Boolean,
            default: false
        },
        //打开时文字
        activeText: {
            type: String,
            default: ''
        },
        //关闭时文字
        inactiveText: {
            type: String,
            default: ''
        },
        //是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        //原生name
        name: {
            type: String,
            default: ''
        },
        //打开时图标类名
        activeIconClass: {
            type: String,
            default: ''
        },
        //关闭时图标类名
        inactiveIconClass: {
            type: String,
            default: ''
        }
    },
    render(h) {
        return (
                <el-switch
                        v-model={this.select}
                        activeColor={this.activeColor}
                        inactiveColor={this.inactiveColor}
                        activeText={this.activeText}
                        inactiveText={this.inactiveText}
                        disabled={this.disabled}
                        name={this.name}
                        activeIconClass={this.activeIconClass}
                        inactiveIconClass={this.inactiveIconClass}
                        ref={'switch'}
                        onChange={(e) => {
                            this.$emit('change', e);
                        }}
                />
        );
    },
    data() {
        return {
            select: this.value
        };
    },
    methods: {
        focus() {
            this.$refs.switch.focus();
        }
    }
};