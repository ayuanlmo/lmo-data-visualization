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
                        'change': (e) => {
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
    watch: {
        value: function (n) {
            this.tVal = n;
        }
    },
    props: {
        value: {
            type: String,
            default: ''
        }
    }
};