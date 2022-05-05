void function (doc, global, echarts) {
    const renderDom = doc.getElementById('canvas');
    const myChart = echarts.init(renderDom, null, {renderer: 'svg'});

    let data = '';

    const setTitle = () => {
        d3.select('.title_main').text(chartConfig.text.mainTitle.text).style('color', chartConfig.text.mainTitle.color);
        d3.select('.title_sub').text(chartConfig.text.subTitle.text).style('color', chartConfig.text.subTitle.color);
        d3.select('.data_source').text(chartConfig.text.dataSource.text).style('color', chartConfig.text.dataSource.color);
    };

    const init = (text) => {
        const xAxisData = [];
        const seriesData = [];

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
        let timerDuration = chartConfig.duration / seriesData.length;

        const timer = setInterval(() => {
            if (i !== seriesData.length - 1) {
                i += 1;
                option.series.push(seriesData[i]);
                console.log(option);
                myChart.setOption(option);
            } else {
                console.log('PlayEnd')
                clearInterval(timer);
            }

        }, 1000);
    };
    setTitle()
    fetch('data.csv').then(res => {
        return res.text();
    }).then(text => {
        data = text;
        chartConfig.data = data;
        chartConfig.defaultData = data;
        parent.postMessage(chartConfig, location.origin);
        init(data.split('\r\n'));
    });
// eslint-disable-next-line no-undef
}(document, window ?? global, echarts ?? window.echarts, d3 ?? window.d3);