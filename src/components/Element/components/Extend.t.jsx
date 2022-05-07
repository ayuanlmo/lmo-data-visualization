export default {
    name:'lmo-extend',
    props: {
        params: {
            type: Object
        },
        render: {
            type: Function
        }
    },
    render(h) {
        return this.render(h, this.params);
    }
};