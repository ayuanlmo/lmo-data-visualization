void function (doc, global, echarts, d3) {
    let ChartConfig = window['chartConfig'] || window.chartConfig;
    const renderDom = doc.getElementById('canvas');
    const appDom = doc.getElementById('app');
    const myChart = echarts.init(renderDom, null, {renderer: 'svg'});

    let data = '';

    let csvData = null;

    let timer = null;
    const onMessage = (msg) => {
        const m = msg.data;

        if (msg.origin === location.origin) {
            if (m.type === 'UpdateData') {
                ChartConfig.data = m.data;
                const data = [];

                ChartConfig.data.split('\r\n').map(i => {
                    if (i !== '')
                        data.push(i);
                });
                csvData = data;
                init(data, true);
            }
            if (m.type === 'UpdateText') {
                ChartConfig.text = m.data;
                init(csvData, false);
            }
            if (m.type === 'UpdateColor') {
                ChartConfig.color = m.data;
                setTitle();
            }
            if (m.type === 'UpdateThemeColor') {
                ChartConfig.themeColorKey = m.data.index;
                ChartConfig.themeColor = m.data.colors;
                init(csvData, true);
            }
            if (m.type === 'UpdateBackground_image') {
                ChartConfig.background = m.data;
                initBackground();
            }
            if (m.type === 'UpdateAnimateName') {
                ChartConfig.titleAnimateName = m.data;
                init(csvData, true);
            }
            if (m.type === 'Preview') {
                ChartConfig = m.data;
                init(csvData ?? ChartConfig.data.split('\r\n'), true);
                initBackground();
            }
            if (m.type === 'Play') {
                init(csvData ?? ChartConfig.data.split('\r\n'), true);
                initBackground();
            }
            if (m.type === 'UpdateDuration') {
                ChartConfig.duration = m.data;
                init(csvData ?? ChartConfig.data.split('\r\n'), true);
                initBackground();
            }
            parent.postMessage({
                type: 'FullConfig',
                data: ChartConfig
            }, location.origin);
        }
    };


    const setTitle = () => {
        d3.select('.title_main').text(ChartConfig.text.mainTitle.value).style('color', ChartConfig.color.mainTitle.value);
        d3.select('.title_sub').text(ChartConfig.text.subTitle.value).style('color', ChartConfig.color.subTitle.value);
        d3.select('.data_source').text(ChartConfig.text.dataSource.value);
        d3.select('.from').style('color', ChartConfig.color.dataSource.value);
    };
    const setTitleAnimate = () => {
        const el = document.getElementById('text');

        el.className = `animated  ${ChartConfig.titleAnimateName}`;
        setTimeout(() => {
            el.className = '';
        }, ChartConfig.titleAnimateDuration);
    };
    const initBackground = () => {
        if (ChartConfig.background.image !== '')
            appDom.style.background = `url(${ChartConfig.background.image}) ${ChartConfig.background.arrange}`;
        else
            appDom.style.background = ChartConfig.background.color;
    };

    const init = (text, update = false) => {
        setTitleAnimate();
        setTitle();
        parent.postMessage({
            type: 'Play',
            data: 0
        }, location.origin);
        const xAxisData = [];
        const seriesData = [];

        clearInterval(timer);
        if (update)
            myChart && myChart.clear();
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
                parent.postMessage({
                    type: 'PlayEnd',
                    data: 0
                }, location.origin);
                clearInterval(timer);
            }
        }, timerDuration);
    };

    if (ChartConfig.isCustom === 0)
        init(csvData ?? ChartConfig.data.split('\r\n'), true);
    else {
        window.addEventListener('message', onMessage);
        fetch('data.csv').then(res => {
            return res.text();
        }).then(text => {
            data = text;
            ChartConfig.data = data;
            ChartConfig.defaultData = data;
            csvData = ChartConfig.data.split('\r\n');
            if (location.search === '' || location.search.split('=')[1] !== 'preview') {
                parent.postMessage({
                    type: 'first',
                    data: ChartConfig
                }, location.origin);
                init(csvData);
            }
        });
    }
    setTitle();
    initBackground();
}(document, window ?? global, window['echarts'] ?? window.echarts, window['d3'] ?? window.d3);