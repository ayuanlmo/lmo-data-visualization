const config = {
    config: {
        text: {
            mainTitle: {
                color: '#000',
                value: '主标题',
                display: true,
                fontSize: 48,
                align: 'left',
                width: 200,
                height: 120,
                x: 160,
                y: 19.2
            },
            subTitle: {
                color: '#000',
                value: '副标题',
                display: true,
                fontSize: 32,
                align: 'left',
                width: 100,
                height: 120,
                x: 368,
                y: 35
            },
            fromSource: {
                color: '#000',
                value: '数据来源：某组织',
                display: true,
                fontSize: 32,
                align: 'left',
                width: 280,
                height: 120,
                x: 160,
                y: 85
            }
        },
        theme: {
            type: 'Theme',
            configs: ['Gradient', 'Single', 'Theme'],
            value: ['#28C8D5', '#1CA8E3', '#1CA8E3', '#5169CA', '#5837A6', '#BF39A7', '#E54574', '#F47F22']
        },
        background: {
            type: 'theme', color: '#ffffff', image: '', arrangement: ''
        },
        video: {
            duration: 5000, fps: 30, clarity: '1080P'
        },
        audio: {
            path: '', full: false, volume: 100
        }
    }, otherConfig: {
        label: '图表其他配置',
        configs: [
            {
                label: '平滑曲线', key: 'smooth', type: 'switch', value: true
            },
            {
                label: '格子线条', key: 'showLine', type: 'switch', value: true
            },
            {
                label: 'X轴', key: 'showXAxis', type: 'switch', value: true
            },
            {
                label: 'Y轴', key: 'showYAxis', type: 'switch', value: true
            },
            {
                label: '节点大小', key: 'nodeSize', type: 'input-number', value: 20
            },
            {
                label: '线条宽度', key: 'lineWidth', type: 'input-number', value: 8
            },
            {
                label: 'X轴字体大小', key: 'xAxisFontSize', type: 'input-number', value: 16
            },
            {
                label: 'Y轴字体大小', key: 'yAxisFontSize', type: 'input-number', value: 16
            },
            {
                label: 'X轴字体颜色', key: 'xAxisFontColor', type: 'input-number', value: 16
            },
            {
                label: 'Y轴字体颜色', key: 'yAxisFontColor', type: 'input-number', value: 16
            }
        ], values: {
            smooth: true,
            showLine: true,
            showXAxis: true,
            showYAxis: true,
            nodeSize: 20,
            lineWidth: 8,
            xAxisFontSize: 16,
            yAxisFontSize: 16,
            yAxisFontColor: '#000',
            xAxisFontColor: '#000'
        }
    }
};

export default config;
