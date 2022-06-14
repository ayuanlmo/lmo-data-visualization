void function (doc, global, echarts, d3) {
    let ChartConfig = window.chartConfig || window['chartConfig'];

    let option = {};
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
                // setTitle();
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
        if (ChartConfig.background.image !== '')
            appDom.style.background = `url(${ChartConfig.background.image}) ${ChartConfig.background.arrange}`;
        else
            appDom.style.background = ChartConfig.background.color;

    };
    const init = (text, update = false) => {
        console.log('themeColor', ChartConfig.themeColor);
        option = {
            visualMap: {
                x: '450',
                y: '820',
                show: ChartConfig.text.visualMap.value,
                splitList: [
                    // {
                    //     start: 1500
                    // },
                    // {
                    //     start: 900,
                    //     end: 1500
                    // },
                    // {
                    //     start: 310,
                    //     end: 1000
                    // },
                    // {
                    //     start: 200,
                    //     end: 300
                    // },
                    // {
                    //     start: 10,
                    //     end: 200
                    // },
                    // {
                    //     end: 10
                    // }
                ],
                color: ChartConfig.themeColor
                // inRange: {
                //     colors: ChartConfig.themeColor
                // }
            },
            roamController: {
                show: true,
                x: 'right',
                mapTypeControl: {
                    'china': true
                },
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
        setTitleAnimate();
        setTitle();
        parent.postMessage({
            type: 'Play',
            data: 0
        }, location.origin);
        const timerDuration = ChartConfig.duration / textData.length;//每条持续时间

        clearInterval(timer);
        myChart && myChart.clear();
        myChart.setOption(option);
        option.series[0].data = [];
        myChart.setOption(option);
        let i = -1;

        timer = setInterval(() => {
            i += 1;
            if (i === text.length - 1)
                return clearInterval(timer);
            const _tempData = textData[i].split(',');

            d3.select('.value').transition().tween('text', () => {
                return function (t) {
                    this.textContent = _tempData[0] + d3.interpolateRound(0, _tempData[1])(t);
                };
            }).duration(timerDuration);
            option.series[0].data.push({
                name: _tempData[0],
                value: _tempData[1]
            });
            myChart.setOption(option);
        }, timerDuration);
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
}(document, window ?? global, window['echarts'] ?? window.echarts, window['d3'] ?? window.d3);