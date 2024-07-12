import LmoTemplate, {ILMOTemplateImplementsMethods} from "../../scripts/template.js";
import {
    ITemplateConfig,
    TConfigOtherConfigItemValueType,
    TOtherConfig,
    TThemeConfig
} from "../../scripts/@types/template.js";
import Conf from './conf.js';
import {getDiffColor} from "../../scripts/utils.js";

interface IOtherConfigProxyHandlers {
    type: (value: string) => void;
    labelFontSize: (value: number) => void;
    labelFontColor: (value: string) => void;
    borderRadius: (value: string) => void;
    centerRadius: (value: number) => void;
    showLabel: (value: boolean) => void;
}

void function (): void {
    class PieChart extends LmoTemplate implements ILMOTemplateImplementsMethods {
        private option: any;
        private chart: any;
        private otherConfigProxyHandlers: IOtherConfigProxyHandlers | null;
        private otherConfigProxy: {
            [key: string]: TConfigOtherConfigItemValueType
        } | null;

        constructor() {
            super(Conf);
            this.otherConfigProxyHandlers = null;
            this.otherConfigProxy = null;
            this.init();
        }

        public render(): void | Promise<void> {
            const series = {
                ...this.option.series[0],
                animationDuration: 5000,
                animation: true,
                type: 'pie',
                radius: [this.conf.otherConfig.values.centerRadius, `80%`],
                data: [],
                itemStyle: {
                    borderRadius: this.conf.otherConfig.values.borderRadius
                },
                label: {
                    show: this.conf.otherConfig.values.showLabel,
                    color: this.conf.otherConfig.values.labelFontColor,
                    fontSize: this.conf.otherConfig.values.labelFontSize,
                    height: 100
                }
            };

            if (this.conf.otherConfig.values.type === 'radius')
                series.roseType = 'radius';

            this.option.series[0] = series;

            const getSeriesData = () => {
                const _data: Array<{
                    value: string,
                    name: string
                }> = [];
                const {conf}: { conf: ITemplateConfig } = this;

                if (!conf.data) return;

                conf.data.forEach((item: Array<string>) => {
                    _data.push({
                        value: item[1],
                        name: item[0]
                    });
                });

                return _data;
            };

            this.option.series[0].animationDuration = this.conf.config.video.duration;
            this.option.series[0].data = getSeriesData();
            this.chart.clear();
            this.chart.setOption(this.option);
        }

        public otherConfigChange(config: TOtherConfig): void {
            Object.keys(config.values).forEach((key: string): void => {
                if (this.otherConfigProxy)
                    this.otherConfigProxy[key] = config.values[key];
            });
        }

        public themeColorChange(config: TThemeConfig): void {
            if (config.type === 'Gradient') {
                const length: number = this.conf.data?.length ?? 0;
                this.option.series[0].color = getDiffColor(config.value[0], config.value[1], length, 1);
            } else if (config.type === 'Theme')
                this.option.series[0].color = config.value;
            else
                this.option.series[0].color = config.value;

            this.tryRender();
        }

        private init(): void {
            this.otherConfigProxyHandlers = {
                type: (value: string): void => {
                    this.option.series[0].roseType = value === 'rose' ? 'radius' : '';
                    this.tryRender();
                },
                labelFontSize: (value: number): void => void (this.option.series[0].label.fontSize = value),
                labelFontColor: (value: string): void => void (this.option.series[0].label.color = value),
                borderRadius: (value: string): void => void (this.option.series[0].itemStyle.borderRadius = value),
                centerRadius: (value: number): void => void (this.option.series[0].radius = [value, '70%']),
                showLabel: (value: boolean): void => void (this.option.series[0].label.show = value)
            };

            this.otherConfigProxy = new Proxy(this.conf.otherConfig.values, {
                set: (
                    target: {
                        [p: string]: TConfigOtherConfigItemValueType
                    },
                    key: keyof IOtherConfigProxyHandlers,
                    value: never
                ) => {
                    if (this.otherConfigProxyHandlers) {
                        if (target[key] !== value && this.otherConfigProxyHandlers[key]) {
                            this.otherConfigProxyHandlers[key](value);
                            const renderKeys: Array<string> = ['type'] as const;

                            if (renderKeys.includes(key))
                                this.tryRender();
                            else
                                this.chart.setOption(this.option, true, true);
                        }
                    }

                    return Reflect.set(target, key, value);
                }
            });

            this.chart = window.echarts.init(document.getElementById('app'), {
                renderer: 'svg'
            });
            this.option = {
                silent: true,
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: false
                },
                animationType: 'zoom',
                series: [
                    {
                        animationDuration: this.conf.config.video.duration,
                        animation: true,
                        type: 'pie',
                        data: [],
                        color: [],
                        roseType: ''
                    }
                ]
            };
            addEventListener('resize', (): void => {
                this.chart?.resize?.();
            });
        }

    }

    return void new PieChart();
}();
