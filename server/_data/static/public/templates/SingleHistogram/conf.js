import defaultConfigs from "../../script/defaultConfigs.js";

export default {
    data: null,
    defaultData: null,
    text: {
        mainTitle: {
            value: '主标题',
            type: 'lmo-input',
            label: '主标题'
        },
        subTitle: {
            value: '副标题',
            type: 'lmo-input',
            label: '副标题'
        },
        dataSource: {
            value: '某网站',
            type: 'lmo-input',
            label: '数据来源'
        },
        axisFontSize: {
            type: 'lmo-input-number',
            label: '轴字体大小',
            value: '24'
        },
        valueFontSize: {
            type: 'lmo-input-number',
            label: '数值字体大小',
            value: '24'
        },
        animationEffect: {
            type: 'lmo-select',
            label: '动画类型',
            value: 'bounce',
            values: [
                {
                    value: 'bounce',
                    label: '弹性碰撞'
                },
                {
                    value: 'elastic',
                    label: '弹性伸缩'
                },
                {
                    value: 'cubic-in-out',
                    label: '慢入'
                }
            ]
        }
    },
    color: {
        mainTitle: {
            value: '#FBFBFD',
            label: '主标题颜色',
            type: 'lmo-color-picker'
        },
        subTitle: {
            value: '#FBFBFD',
            label: '副标题颜色',
            type: 'lmo-color-picker'
        },
        dataSource: {
            value: '#FBFBFD',
            label: '数据来源颜色',
            type: 'lmo-color-picker'
        },
        more: {
            type: 'Theme',
            config: {}
        }
    },
    titleAnimateName: 'rubberBand',
    titleAnimateDuration: 2000,
    themeColor: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
    ...defaultConfigs,
    themeColorKey: 0,
    background: {
        color: '#0C2856',
        image: '',
        arrange: '0% 0% / 100% 100%'
    },
    duration: 5000
};