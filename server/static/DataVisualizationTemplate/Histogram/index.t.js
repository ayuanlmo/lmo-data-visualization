void function (doc, global, echarts, d3) {
    const ChartConfig = window['chartConfig'] || window.chartConfig;

    let timer = null;

    // eslint-disable-next-line no-undef
    new TempLate(ChartConfig, render);

    function render(text, update = false) {
        parent.postMessage({
            type: 'Play',
            data: 0
        }, location.origin);
        const xAxisData = [];
        const seriesData = [];

        clearInterval(timer);
        if (update)
            this.chart && this.chart.clear();
        text.forEach(i => {
            const t = i.split(',');

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
                    show: ChartConfig.text.xAxisLabel.value,
                    textStyle: {
                        fontSize: ChartConfig.text.xAxisFontSize.value
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: ChartConfig.text.yAxisLabel.value,
                    textStyle: {
                        fontSize: ChartConfig.text.yAxisFontSize.value
                    }
                }
            },
            color: ChartConfig.themeColor,
            animationDuration: 500,
            series: []
        };

        this.chart.setOption(option);
        let i = -1;
        const timerDuration = this.conf.duration / seriesData.length;

        timer = setInterval(() => {
            if (i !== seriesData.length - 1) {
                i += 1;
                option.series.push(seriesData[i]);
                this.chart.setOption(option);
            } else {
                console.log('PlayEnd');
                parent.postMessage({
                    type: 'PlayEnd',
                    data: 0
                }, location.origin);
                clearInterval(timer);
            }
        }, timerDuration);
    }
}(document, window ?? global, window['echarts'] ?? window.echarts, window['d3'] ?? window.d3);