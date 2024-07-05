import LmoTemplate, {ILMOTemplateImplementsMethods} from "../../scripts/template.js";
import {TConfigOtherConfigItemValueType, TOtherConfig, TThemeConfig} from "../../scripts/@types/template.js";
import Conf from './conf.js';
import {getDiffColor} from "../../scripts/utils.js";

interface IOtherConfigProxyHandlers {
    smooth: (value: number) => void;
    showLine: (value: boolean) => void;
    showXAxis: (value: boolean) => void;
    showYAxis: (value: boolean) => void;
    nodeSize: (value: number) => void;
    lineWidth: (value: number) => void;
    xAxisFontSize: (value: number) => void;
    yAxisFontSize: (value: number) => void;
    yAxisFontColor: (value: string) => void;
    xAxisFontColor: (value: string) => void;
}

void function (): void {
    class BumpChart extends LmoTemplate implements ILMOTemplateImplementsMethods {
        private option: any;
        private otherConfigProxyHandlers: IOtherConfigProxyHandlers | null;
        private otherConfigProxy: {
            [p: string]: TConfigOtherConfigItemValueType;
        } | null;
        private chart = echarts.init(document.getElementById('app'), {
            renderer: 'svg'
        });
        private names: Array<string>;
        private years: Array<string>;

        constructor() {
            super(Conf);
            this.otherConfigProxyHandlers = null;
            this.otherConfigProxy = null;
            this.names = [];
            this.years = [];
            this.init();
        }

        otherConfigChange(config: TOtherConfig): void {
            Object.keys(config.values).forEach((key: string): void => {
                if (this.otherConfigProxy)
                    this.otherConfigProxy[key] = config.values[key];
            });
        }

        render(): void | Promise<void> {
            const data = this.conf.data;
            const {otherConfig} = this.conf;

            this.names = [];
            this.years = [];

            if (!Array.isArray(data)) return;

            data.forEach((row, index): void => {
                if (Array.isArray(row) && row.length > 0) {
                    // 名称跳过第一行
                    if (index === 0) this.names.push(...row.slice(1)); else this.years.push(row[0]);
                }
            });

            const generateRankingData = () => {
                const map = new Map();

                this.names.forEach((name: string, k: number): void => {
                    const itemData = data.slice(1) // 跳过第一行
                        // 过滤非数组项
                        .filter(item => Array.isArray(item))
                        // 提取第 k 列的数据
                        .map(item => item[k]);
                    map.set(name, itemData);
                });
                return map;
            };
            const generateSeriesList = () => {
                const seriesList: {
                    name: any;
                    symbolSize: TConfigOtherConfigItemValueType;
                    animationDuration: number;
                    type: string;
                    smooth: TConfigOtherConfigItemValueType;
                    emphasis: { focus: string; };
                    endLabel: { show: boolean; formatter: string; distance: number; };
                    lineStyle: { width: TConfigOtherConfigItemValueType; };
                    data: number[];
                }[] = [];
                const rankingMap = generateRankingData();
                const {otherConfig, config} = this.conf;

                rankingMap.forEach((data, name): void => {
                    const transformedData: Array<number> = transformData(data);
                    const series = {
                        name,
                        symbolSize: otherConfig.values.nodeSize,
                        animationDuration: config.video.duration,
                        type: 'line',
                        smooth: otherConfig.values.smooth ?? true,
                        emphasis: {
                            focus: 'series'
                        },
                        endLabel: {
                            show: true,
                            formatter: '{a}',
                            distance: 20
                        },
                        lineStyle: {
                            width: otherConfig.values.lineWidth
                        },
                        data: transformedData
                    };
                    seriesList.push(series);
                });
                return seriesList;
            };
            const transformData = (data: Array<number>) => {
                return data.map((item: number): number => {
                    const num: number = Number(item);

                    if (isNaN(num)) return 0;
                    if (num >= 10) return Math.floor(num / 10); // 取整
                    return num;
                });
            };
            this.option = {
                silent: true,
                color: this.option ? this.option.color : this.conf.config.theme.value,
                grid: {
                    left: 30,
                    right: 110,
                    bottom: 30,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    show: otherConfig.values.showXAxis,
                    splitLine: {
                        show: otherConfig.values.showLine,
                    },
                    axisLabel: {
                        margin: 30,
                        fontSize: otherConfig.values.xAxisFontSize,
                        color: otherConfig.values.xAxisFontColor,
                    },
                    boundaryGap: false,
                    data: this.years
                },
                yAxis: {
                    type: 'value',
                    show: otherConfig.values.showYAxis,
                    splitLine: {
                        show: otherConfig.values.showLine,
                    },
                    axisLabel: {
                        margin: 30,
                        color: otherConfig.values.yAxisFontColor,
                        fontSize: otherConfig.values.yAxisFontSize,
                        formatter: '#{value}'
                    },
                    inverse: true,
                    interval: 1,
                    min: 1,
                    max: this.names.length
                }
            };
            this.option.xAxis.data = this.years;
            this.option.series = generateSeriesList();
            this.chart.clear();
            this.chart?.setOption?.(this.option);
        }

        themeColorChange(config: TThemeConfig): void {
            if (config.type === 'Gradient')
                this.option.color = getDiffColor(config.value[0], config.value[1], this.names.length, 1);
            else if (config.type === 'Theme')
                this.option.color = config.value;
            else
                this.option.color = config.value;
            this.chart.clear();
            this.tryRender();
        }

        private init(): void {
            this.otherConfigProxyHandlers = {
                smooth: (value: number): void => {
                    this.option.series = this.option.series.map((i: any) => ({...i, smooth: value}));
                    this.chart?.clear?.();
                    this.tryRender();
                },
                showLine: (value: boolean): void => {
                    this.option.xAxis.splitLine.show = value;
                    this.option.yAxis.splitLine.show = value;
                    this.chart.clear();
                    this.tryRender();
                },
                showXAxis: (value: boolean): void => void (this.option.xAxis.show = value),
                showYAxis: (value: boolean): void => void (this.option.yAxis.show = value),
                nodeSize: (value: number): void => void (this.option.series = this.option.series.map((i: any) => ({
                    ...i,
                    symbolSize: value
                }))),
                lineWidth: (value: number): void => void (this.option.series = this.option.series.map((i: any) => ({
                    ...i,
                    lineStyle: {width: value}
                }))),
                xAxisFontSize: (value: number): void => void (this.option.xAxis.axisLabel.fontSize = value),
                yAxisFontSize: (value: number): void => void (this.option.yAxis.axisLabel.fontSize = value),
                yAxisFontColor: (value: string): void => void (this.option.yAxis.axisLabel.color = value),
                xAxisFontColor: (value: string): void => void (this.option.xAxis.axisLabel.color = value)
            };

            this.otherConfigProxy = new Proxy(this.conf.otherConfig.values, {
                set: (target: {
                          [p: string]: TConfigOtherConfigItemValueType;
                      },
                      key: keyof IOtherConfigProxyHandlers,
                      value: never) => {

                    if (this.otherConfigProxyHandlers) {
                        if (target[key] !== value && this.otherConfigProxyHandlers[key]) {
                            this.otherConfigProxyHandlers[key](value);
                            this.tryRender();
                        }
                    }
                    return Reflect.set(target, key, value);
                }
            });

            addEventListener('resize', (): void => {
                this.chart?.resize?.();
            });
        }
    }

    return void new BumpChart()
}();