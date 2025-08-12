import LmoTemplate, {ILMOTemplateImplementsMethods} from "../../scripts/template.js";
import {TConfigOtherConfigItemValueType, TOtherConfig, TThemeConfig} from "../../scripts/@types/template";
import Conf from "./conf.js";
import {getDiffColor} from "../../scripts/utils.js";

interface IOtherConfigProxyHandlers {
    lineType: (value: string) => void;
    lineWidth: (value: number) => void;
    lineSymbolSize: (value: number) => void;
    smooth: (value: boolean) => void;
    showDynamicValues: (value: boolean) => void;
    dynamicValuesFontSize: (value: number) => void;
    dynamicValuesUnitName: (value: string) => void;
    dynamicValuesUnitShow: (value: boolean) => void;
    dynamicValuesUnitFontSize: (value: number) => void;
    showDynamicValuesName: (value: boolean) => void;
    showXAxis: (value: boolean) => void;
    xAxisFontSize: (value: number) => void;
    showYAxis: (value: boolean) => void;
    yAxisFontSize: (value: number) => void;
    xAxisFontColor: (value: number) => void;
    yAxisFontColor: (value: number) => void;
}

void function (): void {
    class BaseLineChart extends LmoTemplate implements ILMOTemplateImplementsMethods {
        private option: any;
        private names: string[];
        private years: string[];
        private seriesData: any[];
        private otherConfigProxyHandlers: IOtherConfigProxyHandlers | null;
        private otherConfigProxy: {
            [key: string]: TConfigOtherConfigItemValueType;
        } | null;

        private chart = window.echarts.init(document.getElementById('app'), null, {
            renderer: 'svg'
        });

        constructor() {
            super(Conf);
            this.names = [];
            this.years = [];
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
            this.names = [];
            this.years = [];
            this.seriesData = [];

            const {data, otherConfig} = this.conf;

            if (data && data.length > 0) {
                this.names = data[0].slice(1);

                data.slice(1).forEach((item: string[]): void => {
                    this.years.push(item[0]);
                });

                this.names.forEach((name: string): void => {
                    this.seriesData.push({
                        areaStyle: null,
                        name: name,
                        type: 'line',
                        stack: '',
                        symbolSize: otherConfig.values.lineSymbolSize,
                        smooth: otherConfig.values.smooth,
                        lineStyle: {
                            width: otherConfig.values.lineWidth,
                            type: otherConfig.values.lineType,
                        },
                        data: []
                    });
                });

                for (let i = 1; i < data.length; i++) {
                    const row = data[i];
                    for (let j = 0; j < this.names.length; j++) {
                        this.seriesData[j].data.push(row[j + 1]);
                    }
                }

                this.seriesData = this.seriesData.filter(i => i.data.length > 0);
            }

            const itemDuration: number = (this.conf.config.video.duration / this.years.length) / 1000;

            if (this.option) {
                this.option.xAxis.data = this.years;
                this.option.series = this.seriesData;
                this.option.animationDuration = this.conf.config.video.duration;
                this.initValueNumber();
                this.initAnimateNumber(itemDuration);
                this.initDynamicValuesStyle();
            }

            if (this.chart) {
                this.chart.clear();
                this.chart.setOption(this.option);
            }
        }

        public themeColorChange(config: TThemeConfig): void {
            this.initTheme(config);
        }

        public resize(): void {
            const appEl = document.getElementById('app');
            const valueBox: HTMLDivElement | null = document.querySelector('.value-box');
            if (!valueBox)
                return;

            if (appEl && valueBox) {
                if (this.conf.otherConfig.values.showDynamicValues)
                    appEl.style.height = `${appEl.offsetHeight - (valueBox.offsetHeight - 100)}px`;
                else
                    appEl.style.height = `calc(${document.body.offsetHeight}px - 120px)`;
                this.chart?.resize?.();
            }
        }

        private initDynamicValuesStyle(): void {
            const {values} = this.conf.otherConfig;

            try {
                window.d3.selectAll('.value-item')
                    .style('display', values.showDynamicValues ? '' : 'none');
                window.d3.selectAll('.value-item-label')
                    .style('display', values.showDynamicValuesName ? '' : 'none');
                window.d3.selectAll('.value-item-value')
                    .style('font-size', values.dynamicValuesFontSize + 'px');
                window.d3.selectAll('.value-item-unit')
                    .text(values.dynamicValuesUnitName)
                    .style('display', values.dynamicValuesUnitShow ? '' : 'none')
                    .style('font-size', values.dynamicValuesUnitFontSize + 'px');
            } catch (e) {
                console.log(e);
            }
        }

        private initTheme(config: TThemeConfig): void {
            const {type, value} = config;

            if (type === 'Gradient') {
                const length: number = this.conf.data?.length ?? 0;

                this.option.color = getDiffColor(value[0], value[1], length, 1);
            } else if (type === 'Theme')
                this.option.color = value;
            else
                this.option.color = value;

            this.tryRender();
        }

        private initAnimateNumber(itemDuration: number): void {
            let start = 0;
            let timer: any = null;
            clearInterval(timer);

            const _this = this;

            timer = setInterval((): void => {
                animate();
            }, (itemDuration * 1000));

            function animate() {
                if (start === _this.years.length)
                    clearInterval(timer);
                window.d3.selectAll('.value-item-value')
                    .transition()
                    .tween('text', function (d: any) {
                        // @ts-ignore
                        const node = this;

                        const d1: string = d.data[start - 1];
                        const d2: string = d.data[start];

                        if (!d1 || !d2)
                            return

                        const i = window.d3.interpolateRound(d.data[start - 1], d.data[start]);
                        return function (t: any): void {
                            node.textContent = i(t);
                        };
                    })
                    .duration((itemDuration * 1000));
                start++;
            }

            animate();
        }

        private initValueNumber(): void {
            const valueBox = document.querySelectorAll('.value-box');

            if (valueBox && valueBox.length > 0)
                valueBox[0].innerHTML = '';

            this.option.series.forEach((i: any): void => {
                const valueItem = document.createElement('div');
                valueItem.classList.add('value-item');
                const valueItemLabel = document.createElement('div');
                valueItemLabel.classList.add('value-item-label');
                const valueContent = document.createElement('div');
                valueContent.classList.add('value-content');
                const valueItemValue = document.createElement('span');
                const valueItemUnit = document.createElement('span');

                valueItemValue.classList.add('value-item-value');
                valueItemValue.innerHTML = String(i.data[0]);
                valueItemUnit.classList.add('value-item-unit');
                valueItemUnit.innerText = this.conf.otherConfig.values.dynamicValuesUnitName as string;
                valueItemLabel.innerText = i.name;
                valueItemValue.setAttribute('data-name', i.name);

                valueContent.append(valueItemValue)
                valueContent.append(valueItemUnit)
                valueItem.append(valueItemLabel);
                valueItem.append(valueContent);

                valueBox[0].append(valueItem);
            });

            window.d3.selectAll('.value-item-value')
                .data(this.seriesData)
                .style('color', (_d: any, i: number): string => {
                    return this.conf.config.theme.value[i % this.conf.config.theme.value.length];
                });
        }

        private init(): void {
            this.otherConfigProxyHandlers = {
                lineType: (value: string) => void this.tryRender(),
                lineSymbolSize: (value: number): void => {
                    this.option.series.map((i: any) => {
                        return i.symbolSize = value;
                    });

                    this.chart && this.chart.setOption(this.option);
                },
                lineWidth: (value: number): void => {
                    this.option.series.map((i: any) => {
                        return i.lineStyle.width = value;
                    });

                    this.chart && this.chart.setOption(this.option);
                },
                smooth: () => this.tryRender(),
                showDynamicValues: (value: boolean): void => {
                    void this.initDynamicValuesStyle();
                    this.resize();
                },
                dynamicValuesFontSize: (value: number) => void this.initDynamicValuesStyle(),
                dynamicValuesUnitName: (value: string) => void this.initDynamicValuesStyle(),
                dynamicValuesUnitShow: (value: boolean): void => {
                    void this.initDynamicValuesStyle();
                    this.resize();
                },
                dynamicValuesUnitFontSize: (value: number) => void this.initDynamicValuesStyle(),
                showDynamicValuesName: (value: boolean) => void this.initDynamicValuesStyle(),
                showXAxis: (value: boolean) => this.option.xAxis.show = value,
                showYAxis: (value: boolean) => this.option.yAxis.show = value,
                xAxisFontSize: (value: number) => this.option.xAxis.axisLabel.fontSize = value,
                yAxisFontSize: (value: number) => this.option.yAxis.axisLabel.fontSize = value,
                xAxisFontColor: (value: number) => this.option.xAxis.axisLabel.color = value,
                yAxisFontColor: (value: number) => this.option.yAxis.axisLabel.color = value
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
                            this.chart.setOption(this.option, true, true);
                        }
                    }

                    return Reflect.set(target, key, value);
                }
            })

            this.option = {
                animation: true,
                silent: true,
                animationDuration: this.conf.config.video.duration,
                splitLine: {
                    show: false
                },
                color: this.conf.config.theme.value,
                xAxis: {
                    type: 'category',
                    show: this.conf.otherConfig.values.showXAxis,
                    axisLabel: {
                        fontSize: this.conf.otherConfig.values.xAxisFontSize,
                        color: this.conf.otherConfig.values.xAxisFontColor
                    }
                },
                yAxis: {
                    type: 'value',
                    scale: true,
                    show: this.conf.otherConfig.values.showYAxis,
                    axisLine: {},
                    axisLabel: {
                        fontSize: this.conf.otherConfig.values.yAxisFontSize,
                        color: this.conf.otherConfig.values.yAxisFontColor
                    }
                },
                series: []
            }
            addEventListener('resize', (): void => {
                this.resize();
            });
        }
    }

    return void new BaseLineChart();
}();
