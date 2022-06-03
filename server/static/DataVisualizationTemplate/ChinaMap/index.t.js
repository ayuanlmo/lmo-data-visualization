void function (doc, global, echarts, d3) {
    // eslint-disable-next-line no-undef
    let ChartConfig = window.chartConfig || chartConfig;

    let option = {};

    const renderDom = doc.getElementById('canvas');
    const appDom = doc.getElementById('app');
    const myChart = echarts.init(renderDom, null, {renderer: 'svg'});

    let data = '';

    let csvData = null;

    let timer = null;

    const getDefaultOption = () => {
        return {
            visualMap: {
                x: '450',
                y: '620',
                splitList: [
                    {
                        start: 1500
                    },
                    {
                        start: 900,
                        end: 1500
                    },
                    {
                        start: 310,
                        end: 1000
                    },
                    {
                        start: 200,
                        end: 300
                    },
                    {
                        start: 10,
                        end: 200
                    },
                    {
                        end: 10
                    }
                ]
            },
            roamController: {
                show: true,
                x: 'right',
                mapTypeControl: {
                    'china': true
                }
            },

            color: ChartConfig.themeColor,
            animationDuration: 500,
            series: [{
                zoom: 1.1,
                type: 'map',
                mapType: 'china',
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: ChartConfig.color.mapLabelColor.value,
                            fontSize: 16
                        }
                    }
                },
                roam: false,
                itemStyle: {
                    normal: {
                        borderColor: ChartConfig.color.mapBorderColor.value
                    }
                },
                top: "50",
                data: []
            }]
        };
    };

    option = getDefaultOption();

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
                csvData = data;
                init(data, true);
            }
            if (m.type === 'UpdateText') {
                ChartConfig.text = m.data;
                init(csvData, false);
            }
            if (m.type === 'UpdateColor') {
                ChartConfig.color = m.data;
                option = getDefaultOption();
                // setTitle();
                myChart.setOption(option);
                init(csvData, false);
            }
            if (m.type === 'UpdateThemeColor') {
                ChartConfig.themeColorKey = m.data.index;
                ChartConfig.themeColor = m.data.colors;
                init(csvData, false);
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
        if (ChartConfig.background.image !== '') {
            appDom.style.background = `url(${ChartConfig.background.image}) ${ChartConfig.background.arrange}`;
        } else {
            appDom.style.background = ChartConfig.background.color;
        }
    };

    const init = (text, update = false) => {
        const textData = [];

        //解析数据
        text.forEach((i, k) => {
            //第一条表头数据不要
            if (k !== 0) {
                textData.push(i);
            }
        });
        setTitleAnimate();
        setTitle();
        parent.postMessage({
            type: 'Play',
            data: 0
        }, location.origin);

        function getColor(i) {
            return ChartConfig.themeColor[i % ChartConfig.themeColor.length];
        }

        const timerDuration = ChartConfig.duration / textData.length;//每条持续时间

        clearInterval(timer);

        if (update) {
            myChart && myChart.clear();
            myChart.setOption(option);
        } else {
            option.series[0].data = [];
            myChart.setOption(option);
            // return

            let i = -1;

            timer = setInterval(() => {
                i += 1;

                if (i === text.length - 1) {
                    return clearInterval(timer);
                }
                const _tempData = textData[i].split(',');

                option.series[0].data.push({
                    name: _tempData[0],
                    value: _tempData[1]
                });
                myChart.setOption(option);
            }, timerDuration);
        }


    };

    if (ChartConfig.isCustom === 0) {
        init(csvData ?? ChartConfig.data.split('\r\n'), true);
    } else {
        window.addEventListener('message', onMessage);
        fetch('data.csv').then(res => {
            return res.text();
        }).then(text => {
            data = text;
            ChartConfig.data = data;
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
// eslint-disable-next-line no-undef
}(document, window ?? global, echarts ?? window.echarts, d3 ?? window.d3);