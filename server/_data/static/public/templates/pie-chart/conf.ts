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
                label: '类型',
                key: 'type',
                type: 'select',
                value: 'round',
                options: [
                    {
                        label: '饼图',
                        value: 'round'
                    },
                    {
                        label: '玫瑰图',
                        value: 'radius'
                    }
                ]
            },
            {
                label: '标签字体大小',
                key: 'labelFontSize',
                type: 'input-number',
                value: 16
            },
            {
                label: '显示标签',
                key: 'showLabel',
                type: 'switch',
                value: true
            },
            {
                label: '标签字体颜色',
                key: 'labelFontColor',
                type: 'color',
                value: '#000'
            },
            {
                label: '边框半径',
                key: 'borderRadius',
                type: 'input-number',
                value: 20
            },
            {
                label: '中心半径',
                key: 'centerRadius',
                type: 'input-number',
                value: 0
            }
        ],
        values: {
            type: 'round',
            labelFontSize: 16,
            showLabel: true,
            labelFontColor: '#000',
            borderRadius: 20,
            centerRadius: 0
        }
    }
};

export default config;
