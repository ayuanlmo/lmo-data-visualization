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
            value: '某学校',
            type: 'lmo-input',
            label: '数据来源'
        },
        xAxisFontSize: {
            type: 'lmo-input-number',
            label: 'X轴字体大小',
            value: '24'
        },
        yAxisFontSize: {
            type: 'lmo-input-number',
            label: 'Y轴字体大小',
            value: '24'
        },
        xAxisLabel: {
            type: 'lmo-switch',
            label: 'X轴标签',
            value: true
        },
        yAxisLabel: {
            type: 'lmo-switch',
            label: 'Y轴标签',
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
}