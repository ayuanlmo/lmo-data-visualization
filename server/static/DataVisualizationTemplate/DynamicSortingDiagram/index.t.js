void function (echarts, d3) {
    const ChartConfig = window.chartConfig || window['chartConfig'];

    // eslint-disable-next-line no-undef
    new TempLate(ChartConfig, render);

    function render(text) {
        let option = {};
        const data = [];
        const yAxisData = [];
        const myChart = this.chart;

        this.setTitleAnimate();
        this.initTitle();

        myChart && myChart.clear();
        parent.postMessage({
            type: 'Play',
            data: 0
        }, location.origin);
        text.map(i => {
            data.push({
                type: 'bar',
                label: {
                    show: false
                },
                data: processingValue(i)
            });
            yAxisData.push(i[0]);
        });

        function processingValue(value) {
            const _ = [];

            value.forEach((i, index) => {
                if (index !== 0) {
                    const __ = parseFloat(i);

                    if (!isNaN(__))
                        _.push(__);
                }

            });
            return _;
        }

        option = {
            xAxis: {
                max: 'dataMax',
                axisLabel: {
                    show: this.conf.text.xAxisLabel.value,
                    color: this.conf.color.xAxisFontColor.value,
                    textStyle: {
                        fontSize: this.conf.text.xAxisFontSize.value
                    }
                }
            },
            color: this.conf.themeColor,
            yAxis: {
                type: 'category',
                data: yAxisData,
                inverse: true,
                animationDuration: 500,
                animationDurationUpdate: 500,
                axisLabel: {
                    show: this.conf.text.yAxisLabel.value,
                    color: this.conf.color.yAxisFontColor.value,
                    textStyle: {
                        fontSize: this.conf.text.yAxisFontSize.value
                    }
                }
            },
            series: [
                {
                    realtimeSort: true,
                    name: 'X',
                    type: 'bar',
                    data: data,
                    label: {
                        show: true,
                        position: 'right',
                        valueAnimation: true
                    }
                }
            ],
            legend: {
                show: false
            },
            animationDuration: 0,
            animationDurationUpdate: this.conf.duration,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear'
        };

        setTimeout(function () {
            myChart.setOption({
                series: [].concat(data)
            });
        }, 0);

        option && myChart.setOption(option);
    }

}(window['echarts'] ?? window.echarts, window['d3'] ?? window.d3);