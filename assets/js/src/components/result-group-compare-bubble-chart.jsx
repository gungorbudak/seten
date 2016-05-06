import React from 'react';
import ReactDOM from 'react-dom';
import * as _ from 'lodash';
import d3 from 'd3';


var ResultGroupCompareBubbleChart = React.createClass({
  handleResize: function() {
    this.forceUpdate();
  },
  getChartState: function(width) {
    var component = this;
    var margin = {top: 150, right: 10, bottom: 10, left: 250};
    var collections = this.props.inputCollectionsCompared;
    var data = [];
    var pValue;
    var sample;
    // collect chart data from results
    component.props.results.forEach(function(result) {
      // determine which p-value is active for the result
      pValue = result.enrichmentMethod == 'gse' ||
        (result.enrichmentMethod == 'both' &&
         result.shownPValue == 'gSPValue') ?
        'gSPValue': 'fPValueCorr';
      sample = (pValue == 'gSPValue') ?
        '(GS) ' + result.title: '(F) ' + result.title;
      // for each collection available for that result
      result.collections.forEach(function(collection) {
        // check if the collection is among the ones given
        if (collections.indexOf(collection.id) !== -1) {
          // for each data point in the collection
          collection.data.forEach(function(row) {
            // limit to p-value and percent thresholds
            if (row[pValue] < result.options.pValue &&
                row.percent > result.options.percent) {
              data.push({
                sample: (sample.length > 21) ?
                  sample.substr(0, 18) + '...': sample,
                geneSet: (row.geneSet.length > 38) ?
                  row.geneSet.substr(0, 35) + '...': row.geneSet,
                pValue: row[pValue]
              });
            }
          });
        }
      });
    });
    // height factor is the number of unique gene sets available in data
    // for determining the total height of the final chart
    var heightFactor = data.reduce(function(p, c) {
      if (p.indexOf(c.geneSet) < 0) p.push(c.geneSet);
      return p;
    }, []).length;

    var size = {
      width: width - margin.left - margin.right,
      height: (30 * heightFactor),
      margin: margin
    };

    return {
      size: size,
      data: data
    };
  },
  renderChart: function(el, size, data) {
    var xScale = d3.scale.ordinal()
      .rangePoints([0, size.width], 1)
      .domain(data.map(function(d) { return d.sample; }));

    var yScale = d3.scale.ordinal()
      .rangePoints([0, size.height], 1)
      .domain(data.map(function(d) { return d.geneSet; }));

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("top")
      .innerTickSize(-(size.height + 6));

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .innerTickSize(-(size.width + 6));

    var height = (size.height > 0 ) ?
      size.height + size.margin.top + size.margin.bottom: 0;

    var chart = d3.select(el)
      .select("svg")
      .attr("width", size.width + size.margin.left + size.margin.right)
      .attr("height", height)
      .select(".chart");

    var x = chart.select(".x")
      .call(xAxis);

    x.selectAll("path")
      .style("fill", "none")
      .style("stroke", "#000000")
      .style("shape-rendering", "crispEdges");

    x.selectAll("line")
      .attr("transform", "translate(0,-6)")
      .style("fill", "none")
      .style("stroke", "#000000")
      .style("shape-rendering", "crispEdges")
      .style("opacity", 0.2);

    x.selectAll("text")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .style("text-anchor", "start")
      .attr("dx", "1em")
      .attr("dy", "0.35em")
      .attr("transform", "rotate(-75)");

    var y = chart.select(".y")
      .call(yAxis);

    y.selectAll("path")
      .style("fill", "none")
      .style("stroke", "#000000")
      .style("shape-rendering", "crispEdges");

    y.selectAll("line")
      .attr("transform", "translate(-6,0)")
      .style("fill", "none")
      .style("stroke", "#000000")
      .style("shape-rendering", "crispEdges")
      .style("opacity", 0.2);

    y.selectAll("text")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .style("text-anchor", "end")
      .attr("dx", "-1em")
      .attr("dy", "0.35em");

    var legendData = [];
    if (data.length > 0) {
      legendData = data.map(function (d) {
        return {pValue: d.pValue};
      });
      legendData = _.sortBy(legendData, 'pValue').reverse();
      legendData = [
        legendData[0],
        legendData[parseInt(legendData.length * 0.33)],
        legendData[parseInt(legendData.length * 0.66)],
        legendData[legendData.length - 1]
      ];
    }

    var legend = d3.select('.legend')
      .attr("transform", "translate(-180,-50)")
      .selectAll('.legend-bubble')
      .data(legendData);

    var legendEnter = legend.enter().append("g");
    legendEnter.append("circle");
    legendEnter.append("text");

    legend
      .attr("class", "legend-bubble")
    	.attr("transform", function(d, i) {
        return "translate(" + i * 36 + ",0)"
      });

    legend.select("circle")
      .attr("r", function(d){ return -Math.log10(d.pValue)} )
      .attr("fill", "#F44336")
      .attr("transform", "translate(14,0)");

    legend.select("text")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .attr("dx", "0.5em")
      .attr("dy", "0.35em")
      .attr("transform", "translate(14,0) rotate(-90)")
      .text(function(d) {
        return parseFloat(d.pValue.toPrecision(2)).toExponential();
      });

    legend.exit().remove();

    var bubble = chart.select('.bubbles')
      .selectAll(".bubble")
      .data(data);

    bubble.enter().append("circle")
      .attr("class", "bubble");

    bubble
      .attr("r", function(d) {
        return -Math.log10(d.pValue);
      })
      .attr("transform", function(d) {
        return "translate(" + xScale(d.sample) + "," + yScale(d.geneSet) + ")";
      })
      .style("fill", "#F44336");

    bubble.exit().remove();
  },
  updateChart: function(el, size, data) {
    this.renderChart(el, size, data);
  },
  createChart: function(el, size, data) {
    var svg = d3.select(el)
      .append("svg")
      .attr("id", "bubble-chart")
      .attr("width", size.width + size.margin.left + size.margin.right)
      .attr("height", size.height + size.margin.top + size.margin.bottom)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("version", "1.1");
    // SVG's white background rect
    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#FFFFFF");
    // actual chart
    var chart = svg.append("g")
      .attr("class", "chart")
      .attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");
    // chart elements, axes, legend, bubbles
    chart.append("g").attr("class", "x");
    chart.append("g").attr("class", "y");
    chart.append("g").attr("class", "legend");
    chart.append("g").attr("class", "bubbles");
    // render the chart
    this.updateChart(el, size, data);
  },
  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    var width = el.offsetWidth;
    var state = this.getChartState(width);

    window.addEventListener('resize', this.handleResize);
    this.createChart(el, state.size, state.data);
  },
  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    var width = el.offsetWidth;
    var state = this.getChartState(width);

    this.updateChart(el, state.size, state.data);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },
  render: function() {
    return (
      <div className="bubble-chart">
      </div>
    );
  }
});

export default ResultGroupCompareBubbleChart;
