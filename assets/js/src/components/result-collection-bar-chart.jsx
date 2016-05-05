import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

var ResultCollectionBarChart = React.createClass({
  handleResize: function() {
    this.forceUpdate();
  },
  getChartState: function(width) {
    var panelWidth = width;
    var size = {
      margin: {top: 20, right: 10, bottom: 225, left: 50}
    };
    size.width = panelWidth - size.margin.right - size.margin.left;
    size.height = 450 - size.margin.top - size.margin.bottom;
    var pValue = (this.props.enrichmentMethod == 'gse' ||
      (this.props.enrichmentMethod == 'both' &&
      this.props.shownPValue == 'gSPValue')) ?
      'gSPValue': 'fPValueCorr';

    return {
      size: size,
      data: this.props.data.map(function(el) {
        return {
          // limit axis tick texts to 32 characters
          n: (el.geneSet.length > 32) ?
            el.geneSet.substr(0, 29) + '...': el.geneSet,
          // -Log10 tranformation of p-values
          // for better visualization
          val: -Math.log10(el[pValue])
        };
      }),
      id: this.props.id
    };
  },
  renderChart: function(el, size, data) {
    var yLabel = (this.props.enrichmentMethod == 'gse' ||
      (this.props.enrichmentMethod == 'both' &&
      this.props.shownPValue == 'gSPValue')) ?
      'G. set p-value' : 'Func. p-value corr.';

    data = data.sort(function(a, b) {
      return b.val - a.val;
    });

    var xScale = d3.scale.ordinal()
      .rangeBands([0, size.width], 0.1)
      .domain(data.map(function(d) { return d.n; }));

    var yScale = d3.scale.linear()
      .range([size.height, 0])
      .domain([0, d3.max(data, function(d) { return d.val; })]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .tickFormat(d3.format("d"));

    var chart = d3.select(el)
      .select("svg")
      .attr("width", size.width + size.margin.left + size.margin.right)
      .attr("height", size.height + size.margin.top + size.margin.bottom)
      .select(".chart");

    var x = chart.select('.x')
      .attr("transform", "translate(0," + size.height + ")")
      .call(xAxis)

    x.selectAll("text")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .style("text-anchor", "end")
      .attr("dx", "-1em")
      .attr("dy", "-0.35em")
      .attr("transform", "rotate(-75)");

    x.selectAll("path")
      .style("display", "none");

    x.selectAll("line")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges");

    var y = chart.select('.y');

    y.select('.y-label').text("-Log10(" + yLabel + ")");

    y.call(yAxis);

    y.selectAll("text")
      .style("font-family", "sans-serif")
      .style("font-size", "12px");

    y.selectAll("path")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges");

    y.selectAll("line")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges");

    var bar = chart.select('.bars')
      .selectAll(".bar")
      .data(data);

    bar.enter().append("rect")
      .attr("class", "bar");

    bar.style("fill", "#F44336")
      .attr("x", function(d) { return xScale(d.n); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d.val); })
      .attr("height", function(d) { return size.height - yScale(d.val); });

    bar.exit().remove();
  },
  updateChart: function(el, size, data) {
    this.renderChart(el, size, data);
  },
  createChart: function(el, size, data, id) {
    var svg = d3.select(el)
      .append("svg")
      .attr("id", id)
      .attr("width", size.width + size.margin.left + size.margin.right)
      .attr("height", size.height + size.margin.top + size.margin.bottom)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("version", "1.1");
    // SVG's background rect
    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#ffffff");
    // actual chart
    var chart = svg.append("g")
      .attr("class", "chart")
      .attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");
    // data elements
    chart.append("g").attr("class", "bars");
    chart.append("g").attr("class", "x axis");
    chart.append("g").attr("class", "y axis")
      .append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -(size.height / 2))
      .attr("dy", "1em")
      .attr("dx", "0.35em")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .style("text-anchor", "middle");
    // render the chart
    this.updateChart(el, size, data);
  },
  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this),
    width = el.parentNode.previousSibling.offsetWidth,
    state = this.getChartState(width);

    window.addEventListener('resize', this.handleResize);
    this.createChart(el, state.size, state.data, state.id);
  },
  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this),
    width = el.parentNode.previousSibling.offsetWidth,
    state = this.getChartState(width);
    this.updateChart(el, state.size, state.data);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },
  render: function() {
    return (
      <div className="bar-chart">
      </div>
    );
  }
});

export default ResultCollectionBarChart;
