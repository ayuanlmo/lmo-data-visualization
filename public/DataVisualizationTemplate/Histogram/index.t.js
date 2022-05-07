void function (doc, global, echarts) {
    // eslint-disable-next-line no-undef
    const ChartConfig = window.chartConfig || chartConfig;

    const renderDom = doc.getElementById('canvas');
    const myChart = echarts.init(renderDom, null, {renderer: 'svg'});

    let data = '';

    const onMessage = (msg) => {
        const m = msg.data;

        if (msg.origin === location.origin) {
            if (m.type === 'UpdateData') {
                ChartConfig.data = m.data;

                const data = [];

                ChartConfig.data.split('\r\n').map(i => {
                    if (i !== '') {
                        data.push(i);
                    }
                });
                init(data, true);
            }
        }
    };

    window.addEventListener('message', onMessage);

    const setTitle = () => {
        d3.select('.title_main').text(ChartConfig.text.mainTitle.value).style('color', ChartConfig.text.mainTitle.color);
        d3.select('.title_sub').text(ChartConfig.text.subTitle.value).style('color', ChartConfig.text.subTitle.color);
        d3.select('.data_source').text(ChartConfig.text.dataSource.value).style('color', ChartConfig.text.dataSource.color);
    };

    const init = (text, update = false) => {

        myChart && myChart.clear();
        const xAxisData = [];
        const seriesData = [];

        let timer = null;

        if (update) {
            clearInterval(timer);
        }

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
                    textStyle: {
                        fontSize: 24
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        fontSize: 24
                    }
                }
            },
            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            animationDuration: 500,
            series: []
        };

        myChart.setOption(option);

        let i = -1;

        const timerDuration = ChartConfig.duration / seriesData.length;

        timer = setInterval(() => {
            if (i !== seriesData.length - 1) {
                i += 1;
                option.series.push(seriesData[i]);
                myChart.setOption(option);
            } else {
                console.log('PlayEnd');
                clearInterval(timer);
            }

        }, timerDuration);
    };

    setTitle();
    fetch('data.csv').then(res => {
        return res.text();
    }).then(text => {
        data = text;
        ChartConfig.data = data;
        ChartConfig.defaultData = data;
        parent.postMessage({
            type: 'first',
            data: ChartConfig
        }, location.origin);
        init(ChartConfig.data.split('\r\n'));
    });
// eslint-disable-next-line no-undef
}(document, window ?? global, echarts ?? window.echarts, d3 ?? window.d3);