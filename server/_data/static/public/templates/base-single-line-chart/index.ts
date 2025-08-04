import LmoTemplate, {ILMOTemplateImplementsMethods} from "../../scripts/template.js";
import {TConfigOtherConfigItemValueType, TOtherConfig} from "../../scripts/@types/template.js";
import Conf from './conf.js';

interface IOtherConfigProxyHandlers {
    lineType: (value: string) => void;
    smooth: (value: boolean) => void;
    showYSplitLine: (value: boolean) => void;
    showXSplitLine: (value: boolean) => void;
    lineWidth: (value: number) => void;
    symbolSize: (value: number) => void;
    symbolType: (value: string) => void;
    showXAxis: (value: boolean) => void;
    showYAxis: (value: boolean) => void;
    xAxisFontSize: (value: number) => void;
    yAxisFontSize: (value: number) => void;
    xAxisFontColor: (value: string) => void;
    yAxisFontColor: (value: string) => void;
}

void function (): void {
    class BaseSingleLineChart extends LmoTemplate implements ILMOTemplateImplementsMethods {
        private option: any;
        private chart = window.echarts.init(document.getElementById('app'), null, {
            renderer: 'svg'
        });
        private xAxisData: string[];
        private seriesData: string[];
        private otherConfigProxyHandlers: IOtherConfigProxyHandlers | null;
        private otherConfigProxy: {
            [key: string]: TConfigOtherConfigItemValueType;
        } | null;

        constructor() {
            super(Conf);
            this.xAxisData = [];
            this.seriesData = [];
            this.otherConfigProxyHandlers = null;
            this.otherConfigProxy = null;
            this.init();
        }

        public otherConfigChange(config: TOtherConfig): void {
            Object.keys(config.values).forEach((key: string): void => {
                if (this.otherConfigProxy)
                    this.otherConfigProxy[key] = config.values[key];
            });
        }

        public render(): void | Promise<void> {
            this.chart && this.chart.clear();
            this.xAxisData = [];
            this.seriesData = [];

            const {data, otherConfig: {values}} = this.conf;
            data?.forEach((i: string[]): void => {
                this.xAxisData.push(i[0]);
                this.seriesData.push(i[1]);
            });

            if (this.option) {
                this.option.animationDuration = this.conf.config.video.duration;
                this.option.xAxis.data = this.xAxisData;
                this.option.series[0].data = this.seriesData;
                this.option.series[0].smooth = values.smooth;
            }
            this.chart && this.chart.setOption(this.option);
        };

        public themeColorChange(): void {
            this.initTheme();
        }

        private initTheme(): void {
            const {config: {theme}} = this.conf;
            if (this.option) {
                this.option.series[0].color = theme.value;
                this.chart.setOption(this.option);
            }
        }

        private init(): void {
            const reRenderParams: string[] = ['smooth', 'lineType', 'symbolType'];
            const {config: {theme, video}, otherConfig: {values}} = this.conf;
            const {duration} = video;
            const {
                showXAxis,
                showYAxis,
                smooth,
                symbolSize,
                symbolType,
                lineWidth,
                lineType,
                xAxisFontSize,
                xAxisFontColor,
                yAxisFontSize,
                yAxisFontColor,
                showYSplitLine,
                showXSplitLine
            } = values;

            this.otherConfigProxyHandlers = {
                lineType: (value: string): void => void (this.option.series[0].lineStyle.type = value),
                smooth: (value: boolean): void => void (this.option.series[0].smooth = value),
                showYSplitLine: (value: boolean): void => void (this.option.yAxis.splitLine.show = value),
                showXSplitLine: (value: boolean): void => void (this.option.xAxis.splitLine.show = value),
                lineWidth: (value: number): void => void (this.option.series[0].lineStyle.width = value),
                symbolSize: (value: number): void => void (this.option.series[0].symbolSize = value),
                symbolType: (value: string): void => void (this.option.series[0].symbol = value),
                showXAxis: (value: boolean): void => void (this.option.xAxis.show = value),
                showYAxis: (value: boolean): void => void (this.option.yAxis.show = value),
                xAxisFontSize: (value: number): void => void (this.option.xAxis.axisLabel.fontSize = value),
                yAxisFontSize: (value: number): void => void (this.option.yAxis.axisLabel.fontSize = value),
                xAxisFontColor: (value: string): void => void (this.option.xAxis.axisLabel.color = value),
                yAxisFontColor: (value: string): void => void (this.option.yAxis.axisLabel.color = value)
            };
            this.otherConfigProxy = new Proxy(this.conf.otherConfig.values, {
                set: (
                    target: {
                        [p: string]: TConfigOtherConfigItemValueType;
                    },
                    key: keyof IOtherConfigProxyHandlers,
                    value: never
                ) => {
                    if (this.otherConfigProxyHandlers) {
                        if (target[key] !== value && this.otherConfigProxyHandlers[key]) {
                            this.otherConfigProxyHandlers[key](value);
                            if (reRenderParams.includes(key))
                                this.tryRender();
                            else
                                this.chart.setOption(this.option);
                        }
                    }

                    return Reflect.set(target, key, value);
                }
            });
            this.option = {
                silent: true,
                xAxis: {
                    type: 'category',
                    show: showXAxis,
                    data: [],
                    splitLine: {
                        show: showXSplitLine
                    },
                    axisLabel: {
                        fontSize: xAxisFontSize,
                        color: xAxisFontColor
                    }
                },
                animationDuration: duration,
                yAxis: {
                    type: 'value',
                    show: showYAxis,
                    splitLine: {
                        show: showYSplitLine
                    },
                    axisLabel: {
                        fontSize: yAxisFontSize,
                        color: yAxisFontColor
                    }
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        color: theme.value,
                        smooth: smooth,
                        symbolSize: symbolSize,
                        symbol: symbolType,
                        lineStyle: {
                            width: lineWidth,
                            type: lineType
                        },
                    }
                ]
            };
            this.tryRender();

            addEventListener('resize', (): void => {
                this.chart && this.chart.resize?.();
                this.tryRender();
            });
        }
    }

    return void new BaseSingleLineChart();
}();
