import {ITemplateConfig} from "../../scripts/@types/template.js";
import TemplateDefaultConfig, {TemplateTextDefaultConfig} from "../../scripts/templateDefaultConfig.js";

const config: ITemplateConfig = {
    config: {
        text: {
            ...TemplateTextDefaultConfig,
            fromSource: {
                color: "",
                value: "数据来源：某组织",
                display: true,
                fontSize: 22,
                align: "",
                width: 280,
                height: 120,
                x: 520,
                y: 42
            }
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
                label: '折线样式',
                configs: [
                    {
                        label: "线条类型",
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
                        value: 4,
                        type: "input-number"
                    },
                    {
                        label: "平滑曲线",
                        key: "smooth",
                        value: false,
                        type: "switch"
                    }
                ]
            },
            {
                label: '动态数值样式',
                configs: [
                    {
                        label: "显示",
                        key: "showDynamicValues",
                        value: true,
                        type: "switch"
                    },
                    {
                        label: "值字体大小",
                        key: "dynamicValuesFontSize",
                        value: 28,
                        type: "input-number"
                    },
                    {
                        label: "单位名称",
                        key: "dynamicValuesUnitName",
                        value: "单位",
                        type: "input"
                    },
                    {
                        label: "显示单位",
                        key: "dynamicValuesUnitShow",
                        value: true,
                        type: "switch"
                    },
                    {
                        label: "单位字体大小",
                        key: "dynamicValuesUnitFontSize",
                        value: 22,
                        type: "input-number"
                    },
                    {
                        label: "名称",
                        key: "showDynamicValuesName",
                        value: true,
                        type: "switch"
                    }
                ]
            },
            {
                label: 'X轴',
                configs: [
                    {
                        label: "显示",
                        key: "showXAxis",
                        value: true,
                        type: "switch"
                    },
                    {
                        label: '字体大小', key: 'xAxisFontSize', type: 'input-number', value: 16
                    },
                    {
                        label: '字体颜色', key: 'xAxisFontColor', type: 'color', value: '#000'
                    }
                ]
            },
            {
                label: 'Y轴',
                configs: [
                    {
                        label: "显示", key: "showYAxis", value: true, type: "switch"
                    },
                    {
                        label: '字体大小', key: 'yAxisFontSize', type: 'input-number', value: 16
                    },
                    {
                        label: '字体颜色', key: 'yAxisFontColor', type: 'color', value: '#000'
                    }
                ]
            }
        ],
        values: {
            lineType: 'solid',
            lineWidth: 4,
            lineSymbolSize: 6,
            smooth: false,
            showDynamicValues: true,
            dynamicValuesFontSize: 28,
            dynamicValuesUnitName: '单位',
            dynamicValuesUnitShow: true,
            dynamicValuesUnitFontSize: 22,
            showDynamicValuesName: true,
            showXAxis: true,
            xAxisFontSize: 16,
            yAxisFontSize: 16,
            showYAxis: true,
            xAxisFontColor: '#000',
            yAxisFontColor: '#000'
        }
    },
};

export default config;
