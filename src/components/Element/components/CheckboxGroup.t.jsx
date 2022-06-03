export default {
    name: 'lmo-checkbox-group',
    props: {
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    render(h) {
        return (
                h('el-checkbox-group ', {
                    props: {
                        value: this.value,
                        disabled: this.disabled
                    },
                    on: {
                        change: e => {
                            this.$emit('change', e);
                        }
                    }
                }, [this.text])
        );
    }
};