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
        legend1: {
            value: '示例图例1',
            type: 'lmo-input',
            label: '图例1'
        },
        legend2: {
            value: '示例图例2',
            type: 'lmo-input',
            label: '图例2'
        },
        labelFontSize: {
            type: 'lmo-input-number',
            label: '标签字体大小',
            value: '24'
        },
        showLabel: {
            type: 'lmo-switch',
            label: '显示标签',
            value: false
        },
        visualMap: {
            type: 'lmo-switch',
            label: '视觉地图',
            value: true
        },
        dynamicTags: {
            type: 'lmo-switch',
            label: '动态标签',
            value: true
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
        mapBorderColor: {
            value: '#409fee',
            label: '地图边框颜色',
            type: 'lmo-color-picker'
        },
        mapLabelColor: {
            value: '#12cd16',
            label: '地图标签颜色',
            type: 'lmo-color-picker'
        },
        dynamicTagsColor: {
            value: '#FBFBFD',
            label: '动态标签颜色',
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
    duration: 10000
};