export default {
    name: 'lmo-no-data',
    render(h) {
        return (
            h('el-empty', {
                props: {
                    description: '这里暂时啥也没有'
                }
            })
        );
    }
};