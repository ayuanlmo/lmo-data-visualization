import TempLate from "../../scripts/template.js";
import chartConfig from './conf.js';

void function () {
    new TempLate(chartConfig, render, 'd3');

    function render(text, update = false) {
        const canvas = document.getElementById('canvas');
        const data = {text: [], value: [], all: []};
        const width = this.renderDom.offsetWidth;
        const height = this.renderDom.offsetHeight;
        const padding = {left: 30, right: 30, top: 30, bottom: 30};

        text.map((i, index) => {
            if (index !== 0) {
                data.text.push(i[0]);
                data.value.push(i[1]);
                data.all.push(i.join(','));
            }
        });
        for (let i = 0; i < canvas.children.length; i += 1) {
            canvas.removeChild(canvas.children[i]);
        }
        const SVG = this.d3.select('#canvas').append('svg').attr('width', width).attr("height", height);
        const xScale = this.d3.scale.ordinal().domain(this.d3.range(data.text.length)).rangeRoundBands([0, width - padding.left - padding.right]);//X轴比例尺
        const yScale = this.d3.scale.linear().domain([0, this.d3.max(data.value)]).range([height - padding.top - padding.bottom, 0]);//Y轴比例尺
        const xAxis = this.d3.svg.axis().scale(xScale).orient('bottom');//X轴
        const yAxis = this.d3.svg.axis().scale(yScale).orient('left');//Y轴
        //轴距
        const rectPadding = 12;

        this.d3.selectAll('.tick').attr('font-size', this.conf.text.axisFontSize.value);
        const getColor = (i) => this.conf.themeColor[i % this.conf.themeColor.length];//添加矩形
        const rects = SVG.selectAll('Rect')
            .data(data.value)
            .enter()
            .append('rect')
            .attr('class', 'my-rect')
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function (d, i) {
                return xScale(i) + rectPadding / 2;
            })
            .attr("width", xScale.rangeBand() - rectPadding)
            .attr("y", function () {
                return yScale(yScale.domain()[0]);
            })
            .attr("rx", '24')
            .attr("height", function () {
                return 0;
            })
            .transition()
            .delay(function (d, i) {
                return i * 200;
            })
            .duration(this.conf.duration)
            .ease(this.conf.text.animationEffect.value)
            .attr("y", function (d) {
                return yScale(d);
            })
            .attr("height", function (d) {
                return height - padding.top - padding.bottom - yScale(d);
            });

        const __ = SVG.selectAll('.my-rect')[0];

        for (let i = 0; i < __.length; i += 1) {
            __[i].setAttribute('fill', getColor(i));
        }
        //文字
        const texts = SVG.selectAll('my-text')
            .data(data.value)
            .enter()
            .append('text')
            .attr('fill', '#fdfdfd00')
            // .attr('fill', this.conf.color.valueColor.value)
            .attr('font-size', this.conf.text.valueFontSize.value)
            .attr("class", "my-text")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function (d, i) {
                return xScale(i) + rectPadding / 2;
            })
            .attr("dx", function () {
                return (xScale.rangeBand() - rectPadding) / 2;
            })
            .attr("dy", function () {
                return 20;
            })
            .text(function (d) {
                return d;
            })
            .attr("y", function () {
                return yScale(yScale.domain()[0]);
            })
            .transition()
            .delay(function (d, i) {
                return i * 200;
            })
            .duration(this.conf.duration / 3)
            .ease(this.conf.text.animationEffect.value)
            .attr("y", function (d) {
                return yScale(d);
            });

        //X轴
        // SVG.append('g').attr("class", "x-axis").attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")").attr('fill', '"#ff000000"').call(xAxis);
        //Y轴
        // SVG.append("g").attr("class", "t-axis").attr("transform", "translate(" + padding.left + "," + padding.top + ")").attr('fill', '"#ff000000"').call(yAxis);
    }
}();