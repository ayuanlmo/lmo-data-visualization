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
        animation: {
            chatAnimationIsControllable: true
        },
        ...{
            ...TemplateDefaultConfig,
            video: {
                duration: 10000,
                fps: 30,
                clarity: '1080P'
            }
        }
    },
    otherConfig: {
        group: [
            {
                label: '图表',
                configs: [
                    {
                        label: "格子线条",
                        key: "splitLine",
                        type: "switch",
                        value: true
                    },
                    {
                        label: '数据排序方式',
                        key: 'dataSortType',
                        type: 'select',
                        value: 'default',
                        options: [
                            {
                                label: '默认',
                                value: 'default'
                            },
                            {
                                label: '从小到大',
                                value: 'stb'
                            },
                            {
                                label: '从大到小',
                                value: 'bts'
                            }
                        ]
                    },
                    {
                        label: '条宽度',
                        key: 'barWidth',
                        type: 'input-number',
                        value: 90,
                    }
                ]
            },
            {
                label: 'X轴',
                configs: [
                    {
                        label: "显示",
                        key: "showXAxis",
                        type: "switch",
                        value: true
                    },
                    {
                        label: '预加载X轴数据',
                        key: 'preloadXAxisData',
                        type: 'switch',
                        value: true,
                    },
                    {
                        label: "字体颜色",
                        key: "xAxisFontColor",
                        type: "color",
                        value: '#000'
                    },
                    {
                        label: "字体大小",
                        key: "xAxisFontSize",
                        type: "input-number",
                        value: 12
                    }
                ]
            },
            {
                label: 'Y轴',
                configs: [
                    {
                        label: "显示",
                        key: "showYAxis",
                        type: "switch",
                        value: true
                    },
                    {
                        label: "字体颜色",
                        key: "yAxisFontColor",
                        type: "color",
                        value: '#000'
                    },
                    {
                        label: "字体大小",
                        key: "yAxisFontSize",
                        type: "input-number",
                        value: 12
                    }
                ]
            }
        ],
        values: {
            showXAxis: true,
            splitLine: true,
            xAxisFontSize: 12,
            xAxisFontColor: '#000',
            showYAxis: true,
            yAxisFontSize: 12,
            yAxisFontColor: '#000',
            dataSortType: 'default',
            barWidth: 90,
            preloadXAxisData: true
        }
    }
};

export default config;
