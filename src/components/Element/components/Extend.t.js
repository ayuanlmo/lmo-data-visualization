/**
 * 该组件用于延伸一些场景
 * 想要把你留在这里...
 * @author ayuanlmo
 * Created by ayuanlmo in 2022
 * **/
export default {
    name: 'lmo-extend',
    render(h) {
        return this.render(h, this.params);
    },
    props: {
        params: {
            type: Object
        },
        render: {
            type: Function
        }
    }
};