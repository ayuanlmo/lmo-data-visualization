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
    var PieChart = /** @class */ (function (_super) {
        __extends(PieChart, _super);
        function PieChart() {
            var _this = _super.call(this, Conf) || this;
            _this.otherConfigProxyHandlers = null;
            _this.otherConfigProxy = null;
            _this.init();
            return _this;
        }
        PieChart.prototype.render = function () {
            var _this = this;
            var series = __assign(__assign({}, this.option.series[0]), { animationDuration: 5000, animation: true, type: 'pie', radius: [this.conf.otherConfig.values.centerRadius, "80%"], data: [], itemStyle: {
                    borderRadius: this.conf.otherConfig.values.borderRadius
                }, label: {
                    show: this.conf.otherConfig.values.showLabel,
                    color: this.conf.otherConfig.values.labelFontColor,
                    fontSize: this.conf.otherConfig.values.labelFontSize,
                    height: 100
                } });
            if (this.conf.otherConfig.values.type === 'radius')
                series.roseType = 'radius';
            this.option.series[0] = series;
            var getSeriesData = function () {
                var _data = [];
                var conf = _this.conf;
                if (!conf.data)
                    return;
                conf.data.forEach(function (item) {
                    _data.push({
                        value: item[1],
                        name: item[0]
                    });
                });
                return _data;
            };
            this.option.series[0].animationDuration = this.conf.config.video.duration;
            this.option.series[0].data = getSeriesData();
            this.chart.clear();
            this.chart.setOption(this.option);
        };
        PieChart.prototype.otherConfigChange = function (config) {
            var _this = this;
            Object.keys(config.values).forEach(function (key) {
                if (_this.otherConfigProxy)
                    _this.otherConfigProxy[key] = config.values[key];
            });
        };
        PieChart.prototype.themeColorChange = function (config) {
            var _a, _b;
            if (config.type === 'Gradient') {
                var length_1 = (_b = (_a = this.conf.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
                this.option.series[0].color = getDiffColor(config.value[0], config.value[1], length_1, 1);
            }
            else if (config.type === 'Theme')
                this.option.series[0].color = config.value;
            else
                this.option.series[0].color = config.value;
            this.tryRender();
        };
        PieChart.prototype.init = function () {
            var _this = this;
            this.otherConfigProxyHandlers = {
                type: function (value) {
                    _this.option.series[0].roseType = value === 'rose' ? 'radius' : '';
                    _this.tryRender();
                },
                labelFontSize: function (value) { return void (_this.option.series[0].label.fontSize = value); },
                labelFontColor: function (value) { return void (_this.option.series[0].label.color = value); },
                borderRadius: function (value) { return void (_this.option.series[0].itemStyle.borderRadius = value); },
                centerRadius: function (value) { return void (_this.option.series[0].radius = [value, '70%']); },
                showLabel: function (value) { return void (_this.option.series[0].label.show = value); }
            };
            this.otherConfigProxy = new Proxy(this.conf.otherConfig.values, {
                set: function (target, key, value) {
                    if (_this.otherConfigProxyHandlers) {
                        if (target[key] !== value && _this.otherConfigProxyHandlers[key]) {
                            _this.otherConfigProxyHandlers[key](value);
                            var renderKeys = ['type'];
                            if (renderKeys.includes(key))
                                _this.tryRender();
                            else
                                _this.chart.setOption(_this.option, true, true);
                        }
                    }
                    return Reflect.set(target, key, value);
                }
            });
            this.chart = window.echarts.init(document.getElementById('app'), {
                renderer: 'svg'
            });
            this.option = {
                silent: true,
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: false
                },
                animationType: 'zoom',
                series: [
                    {
                        animationDuration: this.conf.config.video.duration,
                        animation: true,
                        type: 'pie',
                        data: [],
                        color: [],
                        roseType: ''
                    }
                ]
            };
            addEventListener('resize', function () {
                var _a, _b;
                (_b = (_a = _this.chart) === null || _a === void 0 ? void 0 : _a.resize) === null || _b === void 0 ? void 0 : _b.call(_a);
            });
        };
        return PieChart;
    }(LmoTemplate));
    return void new PieChart();
}();
