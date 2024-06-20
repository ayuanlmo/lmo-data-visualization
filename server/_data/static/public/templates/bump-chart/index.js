import TempLate from "../../scripts/template.js";
import Conf from "./conf.js";
import {getDiffColor} from "../../scripts/utils.js";

void function () {
    let option = {};
    const myChart = echarts.init(document.getElementById('app'), {
        renderer: 'svg'
    });
    const template = new TempLate(Conf, render, {
        otherConfigChange: (res) => {
            Object.keys(res).forEach(i => {
                proxy[i] = res[i];
            });
        }
    });
    const propertyHandlers = {
        // 平滑线条
        smooth: (value) => {
            option.series = option.series.map(i => ({...i, smooth: value}));
            myChart.clear();
            template.sendMessage('TEMPLATE_RENDER', 'RENDER');
            myChart.setOption(option);
        },
        // 格子线条
        showLine: (value) => {
            option.xAxis.splitLine.show = value;
            option.yAxis.splitLine.show = value;
            myChart.clear();
            template.sendMessage('TEMPLATE_RENDER', 'RENDER');
            myChart.setOption(option);
        },
        // 显示X轴
        showXAxis: (value) => {
            option.xAxis.show = value;
        },
        // 显示Y轴
        showYAxis: (value) => {
            option.yAxis.show = value;
        },
        // 节点大小
        nodeSize: (value) => {
            option.series = option.series.map(i => ({...i, symbolSize: value}));
        },
        // 线条宽度
        lineWidth: (value) => {
            option.series = option.series.map(i => ({...i, lineStyle: {width: value}}));
        },
        // X轴字体大小
        xAxisFontSize: (value) => {
            option.xAxis.axisLabel.fontSize = value;
        },
        // Y轴字体大小
        yAxisFontSize: (value) => {
            option.yAxis.axisLabel.fontSize = value;
        },
        // X轴字体颜色
        yAxisFontColor: (value) => {
            option.yAxis.axisLabel.color = value;
        },
        // Y轴字体颜色
        xAxisFontColor: (value) => {
            option.xAxis.axisLabel.color = value;
        }
    };
    const proxy = new Proxy(template.conf.otherConfig.values, {
        set(target, key, value) {
            if (target[key] !== value && propertyHandlers[key]) {
                if (Object.keys(option).length === 0) return;
                propertyHandlers[key](value);
                myChart.setOption(option, true, true);
            }
            return Reflect.set(target, key, value);
        }
    });

    function render() {
        const names = [];
        const years = [];
        const {otherConfig} = this.conf;
        const data = this.conf.data;

        if (!Array.isArray(data)) return;

        function initTheme(res) {
            if (res.type === 'Gradient') {
                option.color = getDiffColor(res.value[0], res.value[1], names.length, 1);
            } else if (res.type === 'Theme') {
                option.color = res.value;
            } else {
                option.color = res.value;
            }
            myChart.clear();
            myChart.setOption(option);
            template.sendMessage('TEMPLATE_RENDER', 'RENDER');
        }

        this.event.themeColorChange = res => {
            initTheme(res);
        }
        data.forEach((row, index) => {
            if (Array.isArray(row) && row.length > 0) {
                // 名称跳过第一行
                if (index === 0) names.push(...row.slice(1)); else years.push(row[0]);
            }
        });

        const generateRankingData = () => {
            const map = new Map();

            names.forEach((name, k) => {
                const itemData = data.slice(1) // 跳过第一行
                    // 过滤非数组项
                    .filter(item => Array.isArray(item))
                    // 提取第 k 列的数据
                    .map(item => item[k]);
                map.set(name, itemData);
            });
            return map;
        };

        const generateSeriesList = () => {
            const seriesList = [];
            const rankingMap = generateRankingData();
            const {otherConfig, config} = this.conf;

            rankingMap.forEach((data, name) => {
                const transformedData = transformData(data);
                const series = {
                    name,
                    symbolSize: otherConfig.values.nodeSize,
                    animationDuration: config.video.duration,
                    type: 'line',
                    smooth: otherConfig.values.smooth ?? true,
                    emphasis: {
                        focus: 'series'
                    },
                    endLabel: {
                        show: true,
                        formatter: '{a}',
                        distance: 20
                    },
                    lineStyle: {
                        width: otherConfig.values.lineWidth
                    },
                    data: transformedData
                };
                seriesList.push(series);
            });
            return seriesList;
        };

        const transformData = (data) => {
            return data.map(item => {
                const num = Number(item);

                if (isNaN(num)) return 0;
                if (num >= 10) return Math.floor(num / 10); // 取整
                return num;
            });
        };

        option = {
            silent: true,
            color: this.conf.config.theme.value,
            grid: {
                left: 30,
                right: 110,
                bottom: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                show: otherConfig.values.showXAxis,
                splitLine: {
                    show: otherConfig.values.showLine,
                },
                axisLabel: {
                    margin: 30,
                    fontSize: otherConfig.values.xAxisFontSize,
                    color: otherConfig.values.xAxisFontColor,
                },
                boundaryGap: false,
                data: years
            },
            yAxis: {
                type: 'value',
                show: otherConfig.values.showYAxis,
                splitLine: {
                    show: otherConfig.values.showLine,
                },
                axisLabel: {
                    margin: 30,
                    color: otherConfig.values.yAxisFontColor,
                    fontSize: otherConfig.values.yAxisFontSize,
                    formatter: '#{value}'
                },
                inverse: true,
                interval: 1,
                min: 1,
                max: names.length
            },
            series: generateSeriesList()
        };
        initTheme(this.conf.config.theme);
        template.sendMessage('TEMPLATE_RENDER', 'RENDER');
        myChart.setOption(option);
    }
}();
