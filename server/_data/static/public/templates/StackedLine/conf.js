import defaultConfigs from "../../scripts/defaultConfigs.js";

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
            value: '某平台',
            type: 'lmo-input',
            label: '数据来源'
        },
        legendFontSize: {
            type: 'lmo-input-number',
            label: '图例字体大小',
            value: '24'
        },
        xAxisFontSize: {
            type: 'lmo-input-number',
            label: 'Y轴字体大小',
            value: '24'
        },
        yAxisFontSize: {
            type: 'lmo-input-number',
            label: 'Y轴字体大小',
            value: '24'
        },
        lineSize: {
            type: 'lmo-input-number',
            label: '线条大小',
            value: '10'
        },
        legendItemHeight: {
            type: 'lmo-input-number',
            label: '图例大小',
            value: '16'
        },
        smoothCurve: {
            type: 'lmo-switch',
            label: '平滑曲线',
            value: true
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
        },
        showLegend: {
            type: 'lmo-switch',
            label: '图例',
            value: false
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
        xAxisLabelColor: {
            value: '#FBFBFD',
            label: 'X轴字体颜色',
            type: 'lmo-color-picker'
        },
        yAxisLabelColor: {
            value: '#FBFBFD',
            label: 'Y轴字体颜色',
            type: 'lmo-color-picker'
        },
        legendFontColor: {
            value: '#FBFBFD',
            label: '图例字体颜色',
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
};