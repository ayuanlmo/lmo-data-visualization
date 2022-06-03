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
        disabled:{
            type: Boolean,
            default: false
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
            <el-select v-model={this.data} on-change={e => {
                this.$emit('change', e);
            }}>
                <slot></slot>
            </el-select>
        );
    }
};