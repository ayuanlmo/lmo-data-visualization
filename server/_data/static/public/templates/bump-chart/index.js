var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import LmoTemplate from "../../scripts/template.js";
import Conf from './conf.js';
import { getDiffColor } from "../../scripts/utils.js";
void function () {
    var BumpChart = /** @class */ (function (_super) {
        __extends(BumpChart, _super);
        function BumpChart() {
            var _this = _super.call(this, Conf) || this;
            _this.chart = window.echarts.init(document.getElementById('app'), {
                renderer: 'svg'
            });
            _this.otherConfigProxyHandlers = null;
            _this.otherConfigProxy = null;
            _this.names = [];
            _this.years = [];
            _this.init();
            _this.initTheme(_this.conf.config.theme);
            return _this;
        }
        BumpChart.prototype.otherConfigChange = function (config) {
            var _this = this;
            Object.keys(config.values).forEach(function (key) {
                if (_this.otherConfigProxy)
                    _this.otherConfigProxy[key] = config.values[key];
            });
        };
        BumpChart.prototype.render = function () {
            var _this = this;
            var _a, _b;
            var data = this.conf.data;
            var otherConfig = this.conf.otherConfig;
            this.names = [];
            this.years = [];
            if (!Array.isArray(data))
                return;
            data.forEach(function (row, index) {
                var _a;
                if (Array.isArray(row) && row.length > 0) {
                    // 名称跳过第一行
                    if (index === 0)
                        (_a = _this.names).push.apply(_a, row.slice(1));
                    else
                        _this.years.push(row[0]);
                }
            });
            var generateRankingData = function () {
                var map = new Map();
                _this.names.forEach(function (name, k) {
                    var itemData = data.slice(1) // 跳过第一行
                        // 过滤非数组项
                        .filter(function (item) { return Array.isArray(item); })
                        // 提取第 k 列的数据
                        .map(function (item) { return item[k]; });
                    map.set(name, itemData);
                });
                return map;
            };
            var generateSeriesList = function () {
                var seriesList = [];
                var rankingMap = generateRankingData();
                var _a = _this.conf, otherConfig = _a.otherConfig, config = _a.config;
                rankingMap.forEach(function (data, name) {
                    var _a;
                    var transformedData = transformData(data);
                    var series = {
                        name: name,
                        symbolSize: otherConfig.values.nodeSize,
                        animationDuration: config.video.duration,
                        type: 'line',
                        smooth: (_a = otherConfig.values.smooth) !== null && _a !== void 0 ? _a : true,
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
            var transformData = function (data) {
                return data.map(function (item) {
                    var num = Number(item);
                    if (isNaN(num))
                        return 0;
                    if (num >= 10)
                        return Math.floor(num / 10); // 取整
                    return num;
                });
            };
            this.option = {
                silent: true,
                color: this.option ? this.option.color : this.conf.config.theme.value,
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
                    data: this.years
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
                    max: this.names.length
                }
            };
            this.option.xAxis.data = this.years;
            this.option.series = generateSeriesList();
            this.chart.clear();
            (_b = (_a = this.chart) === null || _a === void 0 ? void 0 : _a.setOption) === null || _b === void 0 ? void 0 : _b.call(_a, this.option);
        };
        BumpChart.prototype.themeColorChange = function (config) {
            this.initTheme(config);
            this.chart.clear();
            this.tryRender();
        };
        BumpChart.prototype.initTheme = function (config) {
            if (config.type === 'Gradient')
                this.option.color = getDiffColor(config.value[0], config.value[1], this.names.length, 1);
            else if (config.type === 'Theme')
                this.option.color = config.value;
            else
                this.option.color = config.value;
        };
        BumpChart.prototype.init = function () {
            var _this = this;
            this.otherConfigProxyHandlers = {
                smooth: function (value) {
                    var _a, _b;
                    _this.option.series = _this.option.series.map(function (i) { return (__assign(__assign({}, i), { smooth: value })); });
                    (_b = (_a = _this.chart) === null || _a === void 0 ? void 0 : _a.clear) === null || _b === void 0 ? void 0 : _b.call(_a);
                    _this.tryRender();
                },
                showLine: function (value) {
                    _this.option.xAxis.splitLine.show = value;
                    _this.option.yAxis.splitLine.show = value;
                    _this.chart.clear();
                    _this.tryRender();
                },
                showXAxis: function (value) { return void (_this.option.xAxis.show = value); },
                showYAxis: function (value) { return void (_this.option.yAxis.show = value); },
                nodeSize: function (value) { return void (_this.option.series = _this.option.series.map(function (i) { return (__assign(__assign({}, i), { symbolSize: value })); })); },
                lineWidth: function (value) { return void (_this.option.series = _this.option.series.map(function (i) { return (__assign(__assign({}, i), { lineStyle: { width: value } })); })); },
                xAxisFontSize: function (value) { return void (_this.option.xAxis.axisLabel.fontSize = value); },
                yAxisFontSize: function (value) { return void (_this.option.yAxis.axisLabel.fontSize = value); },
                yAxisFontColor: function (value) { return void (_this.option.yAxis.axisLabel.color = value); },
                xAxisFontColor: function (value) { return void (_this.option.xAxis.axisLabel.color = value); }
            };
            this.otherConfigProxy = new Proxy(this.conf.otherConfig.values, {
                set: function (target, key, value) {
                    if (_this.otherConfigProxyHandlers) {
                        if (target[key] !== value && _this.otherConfigProxyHandlers[key]) {
                            _this.otherConfigProxyHandlers[key](value);
                            _this.tryRender();
                        }
                    }
                    return Reflect.set(target, key, value);
                }
            });
            addEventListener('resize', function () {
                var _a, _b;
                (_b = (_a = _this.chart) === null || _a === void 0 ? void 0 : _a.resize) === null || _b === void 0 ? void 0 : _b.call(_a);
            });
        };
        return BumpChart;
    }(LmoTemplate));
    return void new BumpChart();
}();
