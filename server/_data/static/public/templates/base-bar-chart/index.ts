import LmoTemplate, {ILMOTemplateImplementsMethods} from "../../scripts/template.js";
import {TConfigOtherConfigItemValueType, TOtherConfig, TThemeConfig} from "../../scripts/@types/template.js";
import Conf from './conf.js';
import {getDiffColor} from "../../scripts/utils.js";

interface IOtherConfigProxyHandlers {
    dataSortType: (value: string) => void;
    preloadXAxisData: (value: boolean) => void;
    barWidth: (value: number) => void;
    showXAxis: (value: boolean) => void;
    xAxisFontSize: (value: number) => void;
    xAxisFontColor: (value: string) => void;
    splitLine: (value: boolean) => void;
    showYAxis: (value: boolean) => void;
    yAxisFontSize: (value: number) => void;
    yAxisFontColor: (value: string) => void;
}

void function (): void {
    class BarChart extends LmoTemplate implements ILMOTemplateImplementsMethods {
        private option: any;
        private chart = window.echarts.init(document.getElementById('app'), {
            renderer: 'svg'
        });
        private names: Array<string>;
        private values: Array<number>;
        private timer: NodeJS.Timeout | null;
        private otherConfigProxyHandlers: IOtherConfigProxyHandlers | null;
        private otherConfigProxy: {
            [key: string]: TConfigOtherConfigItemValueType;
        } | null;

        constructor() {
            super(Conf);
            this.names = [];
            this.values = [];
            this.timer = null;
            this.otherConfigProxy = null;
            this.otherConfigProxyHandlers = null;
            this.init();
            this.initTheme(this.conf.config.theme);
        }

        public otherConfigChange(config: TOtherConfig): void {
            Object.keys(config.values).forEach((key: string): void => {
                if (this.otherConfigProxy)
                    this.otherConfigProxy[key] = config.values[key];
            });
        }

        public render(): void | Promise<void> {
            this.names = [];
            this.values = [];
            this.option.xAxis.data = [];
            this.option.series[0].data = [];
            if (this.timer) clearInterval(this.timer);
            if (this.chart) this.chart.clear();

            const data = JSON.parse(JSON.stringify(this.conf.data ?? []));
            let gradientColors: string[] = [];
            let i: number = 1;

            switch (this.conf.otherConfig.values.dataSortType) {
                case 'stb':
                    data.sort((a: any, b: any): number => a[1] - b[1]);
                    break;
                case 'bts':
                    data.sort((a: any, b: any): number => b[1] - a[1]);
                    break;
            }

            data.forEach((item: Array<any>): void => {
                this.names.push(item[0] as string);
                this.values.push(item[1] as number);
            });

            if (this.names.length !== this.values.length) return;

            this.option.animationDuration = (this.conf.config.video.duration / this.names.length) / 2;
            if (this.conf.otherConfig.values.preloadXAxisData)
                this.option.xAxis.data = this.names;

            if (this.conf.config.theme.type === 'Gradient')
                gradientColors = getDiffColor(this.conf.config.theme.value[0], this.conf.config.theme.value[1], this.names.length, 1);

            const addData = (index: number): void => {
                if (!this.conf.otherConfig.values.preloadXAxisData)
                    this.option.xAxis.data.push(this.names[index]);

                this.option.series[0].data.push({
                    value: this.values[index],
                    itemStyle: {
                        borderRadius: 100,
                        color: this.conf.config.theme.type === 'Gradient' ? gradientColors[index] :
                            this.conf.config.theme.type === 'Theme' ?
                                this.conf.config.theme.value[index % this.conf.config.theme.value.length] : ''
                    }
                });
                this.chart && this.chart.setOption(this.option);
            };

            addData(0);

            const initTimer = (): void => {
                if (this.timer) clearInterval(this.timer);

                this.timer = setInterval((): void => {
                    if (i < this.names.length) {
                        addData(i);
                        i++;
                    } else
                        this.timer && clearInterval(this.timer);
                }, this.conf.config.video.duration / this.names.length);
            }

            initTimer();

            this.addAnimationEventListener('start-animation', (): void => {
                initTimer();
            });
            this.addAnimationEventListener('pause-animation', (): void => {
                this.timer && clearInterval(this.timer);
            });
        };

        public themeColorChange(config: TThemeConfig): void {
            this.initTheme(config);
            this.chart.clear();
            this.tryRender();
        }

        private initTheme(config: TThemeConfig): void {
            if (config.type === 'Gradient') {
                this.option.color = getDiffColor(config.value[0], config.value[1], this.names.length, 1);
            } else if (config.type === 'Theme') {
                this.option.series[0].color = config.value;
                this.tryRender();
            } else
                this.option.color = config.value;
        }

        private init(): void {
            const {otherConfig} = this.conf;

            this.option = {
                silent: true,
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel: {
                        show: otherConfig.values.showXAxis,
                        color: `${otherConfig.values.xAxisFontColor}`,
                        fontSize: otherConfig.values.xAxisFontSize
                    },
                    splitLine: {
                        show: otherConfig.values.splitLine,
                    }
                },
                yAxis: {
                    axisLabel: {
                        show: otherConfig.values.showYAxis,
                        color: `${otherConfig.values.yAxisFontColor}`,
                        fontSize: otherConfig.values.yAxisFontSize
                    },
                    splitLine: {
                        show: otherConfig.values.splitLine,
                    },
                    type: 'value'
                },
                animationDuration: 0,
                series: [
                    {
                        color: [],
                        data: [],
                        type: 'bar'
                    }
                ]
            };

            addEventListener('resize', (): void => {
                this.chart?.resize?.();
            });

            this.otherConfigProxyHandlers = {
                dataSortType: (): void => void this.tryRender(),
                preloadXAxisData: (): void => void this.tryRender(),
                barWidth: (value: number): void => {
                    this.option.series[0].barWidth = `${value}%`;
                    this.tryRender();
                },
                showXAxis: (value: boolean): void => {
                    this.option.xAxis.axisLabel.show = value;
                },
                xAxisFontSize: (value: number): void => {
                    this.option.xAxis.axisLabel.fontSize = value;
                },
                xAxisFontColor: (value: string): void => {
                    this.option.xAxis.axisLabel.color = value;
                },
                showYAxis: (value: boolean): void => {
                    this.option.yAxis.axisLabel.show = value;
                },
                yAxisFontSize: (value: number): void => {
                    this.option.yAxis.axisLabel.fontSize = value;
                },
                yAxisFontColor: (value: string): void => {
                    this.option.yAxis.axisLabel.color = value;
                },
                splitLine: (value: boolean): void => {
                    this.option.xAxis.splitLine.show = value;
                    this.option.yAxis.splitLine.show = value;
                }
            };

            this.otherConfigProxy = new Proxy(this.conf.otherConfig.values, {
                set: (
                    target: {
                        [p: string]: TConfigOtherConfigItemValueType;
                    },
                    key: keyof IOtherConfigProxyHandlers,
                    value: never
                ): boolean => {
                    const keys: Array<string> = ['showXAxis', 'xAxisFontSize', 'xAxisFontColor', 'splitLine', 'showYAxis', 'yAxisFontSize', 'yAxisFontColor'];

                    if (this.otherConfigProxyHandlers) {
                        if (target[key] !== value && this.otherConfigProxyHandlers[key]) {
                            this.otherConfigProxyHandlers[key](value);

                            if (keys.includes(key))
                                this.chart?.setOption?.(this.option);
                        }
                    }

                    return Reflect.set(target, key, value);
                }
            });
        }
    }

    return void new BarChart();
}();
