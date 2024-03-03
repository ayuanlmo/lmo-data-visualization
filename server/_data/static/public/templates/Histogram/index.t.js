/**
 * @author You-YH
 * @description 多柱状图模板
 */
import chartConfig from './conf.js';
import TempLate from "../../scripts/template.js";

void function (doc, global, echarts, d3) {
    const ChartConfig = chartConfig;

    let timer = null;

    // eslint-disable-next-line no-undef
    new TempLate(ChartConfig, render);

    function render(text, update = false) {
        const xAxisData = [];
        const seriesData = [];

        clearInterval(timer);
        if (update)
            this.chart && this.chart.clear();
        text.forEach(i => {
            const t = i;

            xAxisData.push(t[0]);
            seriesData.push({
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: '#ffffff00'
                },
                data: function () {
                    const d = [];

                    for (let i = 1; i < t.length; i += 1) {
                        d.push(t[i]);
                    }
                    return d;
                }()
            });
        });
        const option = {
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    show: this.conf.text.xAxisLabel.value,
                    textStyle: {
                        fontSize: this.conf.text.xAxisFontSize.value
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: this.conf.text.yAxisLabel.value,
                    textStyle: {
                        fontSize: this.conf.text.yAxisFontSize.value
                    }
                }
            },
            color: this.conf.themeColor,
            animationDuration: 500,
            series: []
        };

        this.chart.setOption(option);
        let i = -1;

        timer = setInterval(() => {
            if (i !== seriesData.length - 1) {
                i += 1;
                option.series.push(seriesData[i]);
                this.chart.setOption(option);
            } else
                clearInterval(timer);
        }, this.conf.duration / seriesData.length);
    }
}(document, window ?? global, window['echarts'] ?? window.echarts, window['d3'] ?? window.d3);