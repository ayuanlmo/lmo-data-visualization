export default {
    name: 'lmo-select',
    props: {
        value: {
            type: String,
            default: () => {
                return '';
            }
        },
        type: {
            type: String,
            default: 'text'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        option: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data() {
        return {
            data: ''
        };
    },
    created() {
        this.data = this.value;
    },
    render() {
        return (
                <el-select size={'mini'} v-model={this.data} on-change={e => {
                    this.$emit('change', e);
                }}>
                    {
                        this.option.map(i => {
                            return (
                                    <el-option key={i.value} label={i.label} value={i.value} />
                            );
                        })
                    }
                </el-select>
        );
    }
};