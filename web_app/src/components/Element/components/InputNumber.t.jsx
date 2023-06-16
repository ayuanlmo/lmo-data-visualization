export default {
    name: 'lmo-input-number',
    props: {
        //绑定值
        value: {
            default: 0
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
        //步长
        step: {
            type: Number,
            default: 1
        },
        //大小   可选： large, small
        size: {
            type: String,
            default: 'mini'
        },
        //控制按钮
        controls: {
            type: Boolean,
            default: true
        },
        //防抖
        debounce: {
            type: Number,
            default: 300
        },
        //原生name
        name: {
            type: String,
            default: ''
        },
        //关联的label
        label: {
            type: String,
            default: ''
        }
    },
    render() {
        return (
                <el-input-number
                        v-model={this.num}
                        min={this.min}
                        max={this.max}
                        step={this.step}
                        size={this.size}
                        controls={this.controls}
                        debounce={this.debounce}
                        name={this.name}
                        label={this.label}
                        ref={'inputNumber'}
                        onChange={(e) => {
                            this.$emit('change', e);
                        }}
                        onblur={(e) => {
                            this.$emit('blur', e);
                        }}
                        onfocus={(e) => {
                            this.$emit('focus', e);
                        }}
                />
                // h('el-input-number', {
                //     props: {
                //         value: this.num,
                //         min: this.min,
                //         max: this.max,
                //         step: this.step,
                //         size: this.size,
                //         controls: this.controls,
                //         debounce: this.debounce,
                //         name: this.name,
                //         label: this.label
                //     },
                //     on: {
                //         change: (e) => {
                //
                //         },
                //         blur: (e) => {
                //
                //         },
                //         focus: (e) => {
                //         }
                //     },
                //     ref: 'inputNumber'
                // })
        );
    },
    data() {
        return {
            num: this.value
        };
    },
    methods: {
        focus() {
            this.$refs.inputNumber['focus']();
        }
    }
};