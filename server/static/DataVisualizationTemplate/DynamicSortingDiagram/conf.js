window.chartConfig = {
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
        yAxisFontSize: {
            type: 'lmo-input-number',
            label: 'Y轴字体大小',
            value: '24'
        },
        yAxisLabel: {
            type: 'lmo-switch',
            label: 'Y轴标签',
            value: true
        },
        xAxisFontSize: {
            type: 'lmo-input-number',
            label: 'X轴字体大小',
            value: '24'
        },
        xAxisLabel: {
            type: 'lmo-switch',
            label: 'X轴标签',
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
        yAxisFontColor: {
            value: '#fff',
            label: 'Y轴字体颜色',
            type: 'lmo-color-picker'
        },
        xAxisFontColor: {
            value: '#fff',
            label: 'X轴字体颜色',
            type: 'lmo-color-picker'
        }
    },
    titleAnimateName: 'rubberBand',
    titleAnimateDuration: 2000,
    themeColor: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
    themeColors: [
        {
            value: '0',
            colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272']
        },
        {
            value: '1',
            colors: ["#5AAEF4", "#69deb3", "#526388", "#3289b4", "#ffdc4c", "#FF974C"]
        },
        {
            value: '2',
            colors: ["#4150d8", "#28bf7e", "#ed7c2f", "#f2a93b", "#f9cf36", "#4a5bdc"]
        },
        {
            value: '3',
            colors: ["#00aeef", "#c759a1", "#5552a3", "#00bef3", "#d07cb3", "#6a65ad"]
        },
        {
            value: '4',
            colors: ["#1F358B", "#0064AA", "#00A472", "#A9C8E9", "#D2EAE2", "#B5BFD9"]
        },
        {
            value: '5',
            colors: ["#710C19", "#B12E48", "#ECBD2B", "#CD5532", "#B1D14A", "#ECBBCB"]
        },
        {
            value: '6',
            colors: ["#D75C29", "#F3A502", "#6AA006", "#2A6DB9", "#87409C", "#DD4622"]
        },
        {
            value: '7',
            colors: ["#ED0F64", "#F48897", "#008ED2", "#C3DCF2", "#0064AA", "#6E6CC4"]
        },
        {
            value: '8',
            colors: ["#88071A", "#1E6392", "#003257", "#4092C8", "#B81F37", "#74C9E2"]
        },
        {
            value: '9',
            colors: ["#2E3E96", "#9A4B99", "#2F3452", "#75250D", "#7C98AC", "#B5BFD9"]
        },
        {
            value: '10',
            colors: ["#6674C4", "#FF95D2", "#FACF5B", "#3DC0E4", "#4C6471", "#1B95E6"]
        },
        {
            value: '11',
            colors: ["#EE793D", "#D66329", "#C08D0B", "#927E63", "#765F3D", "#504533"]
        },
        {
            value: '12',
            colors: ["#B7DFCB", "#5ABAD1", "#3984B6", "#264992", "#161F63", "#E0EFCF"]
        },
        {
            value: '13',
            colors: ["#056FFD", "#C58DFF", "#FF87AC", "#FFE05D", "#9EFCC8", "#76ACFF"]
        },
        {
            value: '14',
            colors: ["#218CE3", "#FEE63D", "#FE4B3E", "#6CCEFE", "#0439FF", "#87F5FB"]
        },
        {
            value: '15',
            colors: ["#7C8CDE", "#C0E6DE", "#D7E0E9", "#B3C5D7", "#C5D5EA", "#272727"]
        },
        {
            value: '16',
            colors: ["#153243", "#274B63", "#9BC4BB", "#537A5A", "#66666E", "#537A5A"]
        },
        {
            value: '17',
            colors: ["#191616", "#E6AF2E", "#3D348B", "#BEB7A4", "#5DD39E", "#BCE784"]
        }

    ],
    themeColorKey: 0,
    background: {
        color: '#0C2856',
        image: '',
        arrange: '0% 0% / 100% 100%'
    },
    duration: 5000
};