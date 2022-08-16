/**
 * @author You-YH
 * @description 多折线图模板
 */
void function (doc, global, echarts, d3) {
    const ChartConfig = window['chartConfig'] || window.chartConfig;

    // eslint-disable-next-line no-undef
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
                smooth: ChartConfig.text.smoothCurve.value,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: ChartConfig.text.lineSize.value
                        }
                    }
                }
            });
        });
        seriesData[0].data.map((i, index) => {
            xAxisData.push(`${index += 1}`);
        });
        this.chart.setOption({
            animation: true,
            animationDuration: ChartConfig.duration,
            color: ChartConfig.themeColor,
            legend: {
                data: legendData,
                itemHeight: ChartConfig.text.legendItemHeight.value,
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
                    show: ChartConfig.text.xAxisLabel.value,
                    color: ChartConfig.color.xAxisLabelColor.value,
                    textStyle: {
                        fontSize: ChartConfig.text.xAxisFontSize.value
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: ChartConfig.text.yAxisLabel.value,
                    color: ChartConfig.color.yAxisLabelColor.value,
                    textStyle: {
                        fontSize: ChartConfig.text.yAxisFontSize.value
                    }
                }
            },
            series: [].concat(seriesData)
        });
    }

}(document, window ?? global, window['echarts'] ?? window.echarts, window['d3'] ?? window.d3);
