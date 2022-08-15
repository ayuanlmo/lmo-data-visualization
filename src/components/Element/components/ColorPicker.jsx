export default {
    name: 'lmo-color-picker',
    render(h) {
        return (
                h('el-color-picker', {
                    props: {
                        value: this.value,
                        'color-format': 'hex'
                    },
                    on: {
                        'active-change': (e) => {
                            this.value = e;
                            this.$emit('change', e);
                        }
                    }
                })
        );
    },
    props: {
        value: {
            type: String,
            default: ''
        }
    }
};