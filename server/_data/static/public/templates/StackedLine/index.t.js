import chartConfig from './conf.js'
import TempLate from "../../scripts/template.js";

void function (doc, global, echarts, d3) {
    const ChartConfig = chartConfig

    new TempLate(ChartConfig, render);

    function render(text, update = false) {
        this.chart && this.chart.clear();
        const data = {};
        const legendData = [];
        const seriesData = [];
        const xAxisData = [];

        //拆分数据
        text.map(async (i, index) => {
            if (index !== 0) {
                data[i[0]] = [];
                legendData.push(i[0]);
                await setData(i, i[0]);
            }
            if (index === 0) {
                if (Array.isArray(i)) {
                    i.map((j, k) => {
                        if (k !== 0 && k !== 1) {
                            if (j !== null)
                                xAxisData.push(j);
                        }
                    });
                }
            }
        });

        function setData(arr = [], key = '') {
            arr.forEach((i, index) => {
                //过滤掉年份和地区
                if (index > 1)
                    data[key].push(i);
            });
        }

        Object.keys(data).map(i => {
            seriesData.push({
                name: i,
                type: 'line',
                data: data[i],
                stack: 'Total',
                smooth: this.conf.text.smoothCurve.value,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: this.conf.text.lineSize.value
                        }
                    }
                }
            });
        });
        this.chart.setOption({
            animation: true,
            animationDuration: this.conf.duration,
            color: this.conf.themeColor,
            legend: {
                data: legendData,
                show: this.conf.text.showLegend.value,
                itemHeight: this.conf.text.legendItemHeight.value,
                textStyle: {
                    fontSize: this.conf.text.legendFontSize.value,
                    color: this.conf.color.legendFontColor.value
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData,
                axisLabel: {
                    show: this.conf.text.xAxisLabel.value,
                    color: this.conf.color.xAxisLabelColor.value,
                    textStyle: {
                        fontSize: this.conf.text.xAxisFontSize.value
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: this.conf.text.yAxisLabel.value,
                    color: this.conf.color.yAxisLabelColor.value,
                    textStyle: {
                        fontSize: this.conf.text.yAxisFontSize.value
                    }
                }
            },
            series: [].concat(seriesData)
        });
    }
}(document, window ?? global, window['echarts'] ?? window.echarts, window['d3'] ?? window.d3);
