import {ITemplateConfig} from "../../scripts/@types/template.js";
import TemplateDefaultConfig, {TemplateTextDefaultConfig} from "../../scripts/templateDefaultConfig.js";

const config: ITemplateConfig = {
    config: {
        text: {
            ...TemplateTextDefaultConfig
        },
        theme: {
            type: 'Theme',
            configs: ['Theme', 'Gradient'],
            value: ['#28C8D5', '#1CA8E3', '#1CA8E3', '#5169CA', '#5837A6', '#BF39A7', '#E54574', '#F47F22']
        },
        animation: {
            chartAnimationIsControllable: false
        },
        ...{
            ...TemplateDefaultConfig,
            video: {
                duration: 5000,
                fps: 30,
                clarity: '1080P'
            }
        }
    },
    otherConfig: {
        group: [
            {
                label: '折线配置',
                configs: [
                    {
                        label: '平滑曲线',
                        key: 'smooth',
                        type: 'switch',
                        value: false
                    },
                    {
                        label: "线类型",
                        key: "lineType",
                        type: "select",
                        value: 'solid',
                        options: [
                            {
                                label: '实线',
                                value: 'solid'
                            },
                            {
                                label: '破折线',
                                value: 'dashed'
                            },
                            {
                                label: '点线',
                                value: 'dotted'
                            }
                        ]
                    },
                    {
                        label: "线条宽度",
                        key: "lineWidth",
                        value: 8,
                        type: "input-number"
                    },
                    {
                        label: "符号大小",
                        key: "symbolSize",
                        value: 16,
                        type: "input-number"
                    },
                    {
                        label: "符号类型",
                        key: "symbolType",
                        value: 'emptyCircle',
                        type: "select",
                        options: [
                            {
                                label: "镂空圆形",
                                value: "emptyCircle"
                            },
                            {
                                label: "实心圆形",
                                value: "circle"
                            },
                            {
                                label: "直角形",
                                value: "rect"
                            },
                            {
                                label: "圆角矩形",
                                value: "roundRect"
                            },
                            {
                                label: "三角形",
                                value: "triangle"
                            },
                            {
                                label: "钻石形",
                                value: "diamond"
                            },
                            {
                                label: "针形",
                                value: "pin"
                            },
                            {
                                label: "箭头形",
                                value: "arrow"
                            },
                            {
                                label: "无",
                                value: "none"
                            }
                        ]
                    }
                ],
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
                        label: '格子线条',
                        key: 'showXSplitLine',
                        type: 'switch',
                        value: true
                    },
                    {
                        label: '字体大小',
                        key: 'xAxisFontSize',
                        type: 'input-number',
                        value: 16
                    },
                    {
                        label: '字体颜色',
                        key: 'xAxisFontColor',
                        type: 'color',
                        value: '#000'
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
                        label: '格子线条',
                        key: 'showYSplitLine',
                        type: 'switch',
                        value: true
                    },
                    {
                        label: '字体大小',
                        key: 'yAxisFontSize',
                        type: 'input-number',
                        value: 16
                    },
                    {
                        label: '字体颜色',
                        key: 'yAxisFontColor',
                        type: 'color',
                        value: '#000'
                    }
                ]
            }
        ],
        values: {
            smooth: false,
            lineType: 'solid',
            symbolType: 'emptyCircle',
            lineWidth: 8,
            symbolSize: 16,
            showXAxis: true,
            showXSplitLine: true,
            xAxisFontSize: 16,
            xAxisFontColor: '#000',
            showYAxis: true,
            showYSplitLine: true,
            yAxisFontSize: 16,
            yAxisFontColor: '#000'
        }
    }
};

export default config;
