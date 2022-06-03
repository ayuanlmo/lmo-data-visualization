export default {
    name: 'lmo-color-picker',
    render(h) {
        return (
                h('el-color-picker', {
                    props: {
                        value: this.value
                    },
                    on: {
                        'active-change': (e) => {
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