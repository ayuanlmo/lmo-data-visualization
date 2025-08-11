import LmoTemplate, {ILMOTemplateImplementsMethods} from "../../scripts/template.js";
import {TConfigOtherConfigItemValueType, TOtherConfig, TThemeConfig} from "../../scripts/@types/template.js";
import Conf from './conf.js';
import {getDiffColor} from "../../scripts/utils.js";

interface IOtherConfigProxyHandlers {
    smooth: (value: boolean) => void;
    lineType: (value: string) => void;
    lineWidth: (value: number) => void;
    symbolSize: (value: number) => void;
    symbolType: (value: string) => void;
    showXAxis: (value: boolean) => void;
    showXSplitLine: (value: boolean) => void;
    xAxisFontSize: (value: number) => void;
    xAxisFontColor: (value: string) => void;
    showYAxis: (value: boolean) => void;
    showYSplitLine: (value: boolean) => void;
    yAxisFontSize: (value: number) => void;
    yAxisFontColor: (value: string) => void;
}

void function (): void {
    class BaseStepLine extends LmoTemplate implements ILMOTemplateImplementsMethods {
        private option: any;
        private chart = window.echarts.init(document.getElementById('app'), null, {
            renderer: 'svg'
        });
        private names: string[];
        private seriesData: any[];
        private otherConfigProxyHandlers: IOtherConfigProxyHandlers | null;
        private otherConfigProxy: {
            [key: string]: TConfigOtherConfigItemValueType;
        } | null;

        constructor() {
            super(Conf);
            this.names = [];
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

        public render(): void {
            const {data, otherConfig, config: {video}} = this.conf;
            this.names = [];
            this.seriesData = [];
            if (!data)
                return;
            if (Array.isArray(data) && data.length > 1)
                this.names = data[0];

            const sliceLength: number = data.slice(1).length;

            data.slice(1).forEach((row, index): void => {
                const step: string = index === 0 ? 'start' : index === sliceLength - 1 ? 'end' : 'middle';

                this.seriesData.push({
                    step,
                    type: 'line',
                    data: [...row],
                    smooth: true,
                    symbolSize: otherConfig.values.symbolSize,
                    symbol: otherConfig.values.symbolType,
                    lineStyle: {
                        width: otherConfig.values.lineWidth,
                        type: otherConfig.values.lineType,
                    }
                });
            });

            if (!this.option)
                return;

            this.option.animationDuration = video.duration;
            this.option.xAxis.data = this.names;
            this.option.series = this.seriesData;
            if (this.chart) {
                this.chart.clear?.();
                this.chart.setOption(this.option);
            }
        }

        public themeColorChange(config: TThemeConfig): void {
            this.initTheme(config);
        }

        private updateSeriesData(): void {
            const {otherConfig: {values}} = this.conf;

            this.seriesData.forEach(i => {
                if (i.lineStyle) {
                    i.symbolSize = values.symbolSize;
                    i.symbol = values.symbolType;
                    i.lineStyle.width = values.lineWidth;
                }
                return i;
            });

            this.chart.setOption(this.option);
        }

        private init(): void {
            const reRenderParams: string[] = ['smooth', 'lineType'];

            this.otherConfigProxyHandlers = {
                smooth: (_value: boolean): void => void this.init(),
                lineType: (_value: string): void => void this.init(),
                lineWidth: (_value: number): void => void this.updateSeriesData(),
                symbolSize: (_value: number): void => void this.updateSeriesData(),
                symbolType: (_value: string): void => void this.updateSeriesData(),
                showXAxis: (value: boolean): void => void (this.option.xAxis.show = value),
                showXSplitLine: (value: boolean): void => void (this.option.xAxis.splitLine.show = value),
                xAxisFontSize: (value: number): void => void (this.option.xAxis.axisLabel.fontSize = value),
                xAxisFontColor: (value: string): void => void (this.option.xAxis.axisLabel.color = value),
                showYAxis: (value: boolean): void => void (this.option.yAxis.show = value),
                showYSplitLine: (value: boolean): void => void (this.option.yAxis.splitLine.show = value),
                yAxisFontSize: (value: number): void => void (this.option.yAxis.axisLabel.fontSize = value),
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
            const {config: {theme, video}, otherConfig} = this.conf;
            const {
                showXAxis,
                showXSplitLine,
                xAxisFontSize,
                xAxisFontColor,
                showYAxis,
                showYSplitLine,
                yAxisFontSize,
                yAxisFontColor
            } = otherConfig.values;

            this.option = {
                silent: true,
                animation: true,
                color: theme.value,
                animationDuration: video.duration,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    show: showXAxis,
                    splitLine: {
                        show: showXSplitLine
                    },
                    axisLabel: {
                        fontSize: xAxisFontSize,
                        color: xAxisFontColor,
                    }
                },
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
                series: []
            };

            addEventListener('resize', (): void => {
                this.chart && this.chart.resize?.();
                this.tryRender();
            });
        }

        private initTheme(config: TThemeConfig): void {
            const {type, value} = config;

            if (type === 'Gradient') {
                const length: number = this.conf.data?.length ?? 0;

                this.option.color = getDiffColor(value[0], value[1], length, 1);
            } else
                this.option.color = value;

            this.tryRender();
        }
    }

    return void new BaseStepLine();
}();

