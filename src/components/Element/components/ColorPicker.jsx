export default {
    name: 'lmo-color-picker',
    render(h) {
        return (
                h('el-color-picker', {
                    props: {
                        value: this.tVal,
                        'color-format': 'hex'
                    },
                    on: {
                        'active-change': (e) => {
                            this.tVal = e;
                            this.$emit('change', e);
                        }
                    }
                })
        );
    },
    data() {
        return {
            tVal: ''
        };
    },
    mounted() {
        this.tVal = this.value;
    },
    props: {
        value: {
            type: String,
            default: ''
        }
    }
};