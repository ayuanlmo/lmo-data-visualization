void function (echarts, d3) {
    let option = {};

    let timer = null;
    const ChartConfig = window.chartConfig || window['chartConfig'];

    // eslint-disable-next-line no-undef
    new TempLate(ChartConfig, render);

    function render(text, update = false) {
        option = {
            visualMap: {
                x: '450',
                y: '820',
                show: ChartConfig.text.visualMap.value,
                splitList: [],
                color: ChartConfig.themeColor
            },
            roamController: {
                show: true,
                x: 'right',
                mapTypeControl: {'china': true},
                color: ChartConfig.themeColor
            },
            text: [ChartConfig.text.legend1.value, ChartConfig.text.legend2.value],
            animationDuration: 500,
            series: [{
                zoom: 1.2,
                color: ChartConfig.themeColor,
                type: 'map',
                mapType: 'china',
                label: {
                    normal: {
                        show: ChartConfig.text.showLabel.value,
                        textStyle: {
                            color: ChartConfig.color.mapLabelColor.value,
                            fontSize: ChartConfig.text.labelFontSize.value
                        }
                    }
                },
                roam: false,
                itemStyle: {
                    normal: {
                        borderColor: ChartConfig.color.mapBorderColor.value
                    }
                },
                top: 100,
                data: []
            }]
        };
        const textData = [];

        //解析数据
        text.forEach((i, k) => {
            //第一条表头数据不要
            if (k !== 0)
                textData.push(i);
        });
        this.setTitleAnimate();
        this.initTitle();
        parent.postMessage({
            type: 'Play',
            data: 0
        }, location.origin);
        const timerDuration = this.conf.duration / textData.length;//每条持续时间

        clearInterval(timer);
        this.chart && this.chart.clear();
        this.chart.setOption(option);
        option.series[0].data = [];
        this.chart.setOption(option);
        let i = -1;
        const dynamicTags = d3.select('.value');

        dynamicTags.style('display', ChartConfig.text.dynamicTags.value ? 'block' : 'none');
        dynamicTags.style('color', ChartConfig.color.dynamicTagsColor.value);
        timer = setInterval(() => {
            i += 1;
            if (i === text.length - 1) {
                console.log('PlayEnd');
                dynamicTags.style('display', 'none');
                return clearInterval(timer);
            }
            const _tempData = textData[i].split(',');

            dynamicTags.transition().tween('text', () => {
                return function (t) {
                    if (_tempData[0] === '') return;
                    this.textContent = _tempData[0] + d3.interpolateRound(0, _tempData[1])(t);
                };
            }).duration(timerDuration);
            option.series[0].data.push({
                name: _tempData[0],
                value: _tempData[1]
            });
            this.chart.setOption(option);
        }, timerDuration);
    }
}(window['echarts'] ?? window.echarts, window['d3'] ?? window.d3);