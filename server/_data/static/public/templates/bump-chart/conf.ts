import {ITemplateConfig} from "../../scripts/@types/template.js";
import TemplateDefaultConfig, {TemplateTextDefaultConfig} from "../../scripts/templateDefaultConfig.js";

const config: ITemplateConfig = {
    config: {
        text: {
            ...TemplateTextDefaultConfig
        },
        theme: {
            type: 'Theme',
            configs: ['Gradient', 'Theme'],
            value: ['#28C8D5', '#1CA8E3', '#1CA8E3', '#5169CA', '#5837A6', '#BF39A7', '#E54574', '#F47F22']
        },
        ...TemplateDefaultConfig
    },
    otherConfig: {
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
