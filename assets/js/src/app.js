'use strict';

/*
* Seten source code for browser user interface
* Author: Gungor Budak
*/

// polyfill for browsers lacking log10 method
Math.log10 = Math.log10 || function(x) {
    return Math.log(x) / Math.LN10;
};

// cross-browser click event for exporting
var clickEvent = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': false
});

var PanelExploreItem = React.createClass({
    componentDidMount: function() {
        var $item = $(this.getDOMNode());

        $item.find('button').popover({
            container: '.container-app',
            trigger: 'hover',
            placement: 'auto',
            html: true
        });
    },
    render: function() {
        var item = this.props.item,
            itemSummary = [
                '<table class="table table-condensed table-popover">',
                '<tbody>',
                '<tr><th>Symbol</th><td>' + item.symbol + '</td></tr>',
                '<tr><th>Cell line</th><td>' + item.cellLine + '</td></tr>',
                '<tr><th>Species</th><td>' + item.species + '</td></tr>',
                '<tr><th>Disease state</th><td>' + item.diseaseState + '</td></tr>',
                '</tbody>',
                '</table>'
            ].join('');
        return (
            <div className="list-group-item">
                <span className="label label-info" title={item.id.split('-')[0].toUpperCase()}>
                    {item.id.substr(0, 1).toUpperCase()}
                </span>
                <button
                    href="#"
                    className="btn btn-link btn-xs"
                    title={item.symbol + ' / ' + item.cellLine}
                    id={item.id}
                    data-original-title={item.symbol + ' / ' + item.cellLine}
                    data-content={itemSummary}
                    onClick={this.props.onExploreViewClick}
                    >
                    {item.symbol + ' / ' + item.cellLine}
                </button>
            </div>
        );
    }
});

var PanelExplore = React.createClass({
    getInitialState: function() {
        return {
            explore: this.props.explore
        }
    },
    handleSearchChange: function(e) {
        var query = e.target.value.toLowerCase(),
            explore = this.props.explore;

        if (query.length > 0) {
            this.setState({explore: explore.filter(function(item) {
                return item.symbol.toLowerCase().startsWith(query);
            })});
        } else {
            this.setState({explore: explore});
        }
    },
    render: function() {
        var component = this,
            items;

        if (component.state.explore.length > 0) {
            items = component.state.explore.map(function(item) {
                return (
                    <PanelExploreItem
                        item={item}
                        onExploreViewClick={component.props.onExploreViewClick}
                        onExploreCompareClick={component.props.onExploreCompareClick}
                        />
                );
            });
        } else {
            items = (
                <div className="list-group-item">
                    Your search did not match any RBPs.
                </div>
            );
        }

        return (
            <div className="panel panel-info panel-explore">

                <div className="panel-heading">
                    <h3 className="panel-title">
                        <i className="fa fa-globe"></i>
                        <span>&nbsp;Explore</span>
                    </h3>
                </div>

                <div className="list-group">
                    <div className="list-group-item form-group has-feedback has-search">
                        <span className="glyphicon glyphicon-search form-control-feedback"></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for an RBP"
                            onChange={component.handleSearchChange}
                            />
                    </div>
                </div>

                <div className="list-group list-group-explore">
                    {items}
                </div>

            </div>
        );
    }
});

var PanelAnalyzeBedFile = React.createClass({
    componentDidMount: function(argument) {
        var $item = $(this.getDOMNode());

        $item.find('button').popover({
            container: '.container-app',
            trigger: 'hover',
            placement: 'auto',
            html: true
        });
    },
    render: function () {
        var component = this;
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label">{component.props.label}</label>
                <div className="col-sm-10">
                    <div className="input-group input-group-sm">
                        <span className="input-group-btn">
                            <span
                                className="btn btn-default btn-file"
                                disabled={component.props.disabled}>
                                Browse&hellip;
                                <input
                                    type="file"
                                    name="file"
                                    onChange={component.props.onChange}
                                />
                            </span>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            disabled={component.props.disabled}
                            value={component.props.inputBedFileName}
                            readOnly={true}
                            />
                    </div>
                    <p className="help-block">
                        Sample datasets
                        {component.props.samples.map(function(item) {
                            var dataContent = [
                                '<table class="table table-condensed table-popover">',
                                '<tbody>',
                                '<tr><th>Symbol</th><td>' + item.symbol + '</td></tr>',
                                '<tr><th>Cell line</th><td>' + item.cellLine + '</td></tr>',
                                '<tr><th>Species</th><td>' + item.species + '</td></tr>',
                                '<tr><th>Disease state</th><td>' + item.diseaseState + '</td></tr>',
                                '</tbody>',
                                '</table>'
                            ].join('');
                            return (
                                <button
                                    className="btn btn-link btn-xs"
                                    id={item.id}
                                    title={item.symbol + ' / ' + item.cellLine}
                                    data-original-title={item.symbol + ' / ' + item.cellLine}
                                    data-content={dataContent}
                                    onClick={component.props.onInputSampleBedFileClick}
                                    >
                                    {item.symbol + ' / ' + item.cellLine}
                                </button>
                            );
                        })}
                    </p>
                </div>
            </div>
        );
    }
});

var PanelAnalyzeCollections = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label">{this.props.label}</label>
                <div className="col-sm-10">
                    <select
                        className="form-control"
                        multiple="multiple"
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}>

                        {this.props.options.map(function (option) {
                            return (
                                <option value={option.id} id={option.filename}>{option.name}</option>
                            );
                        })}

                        </select>
                    <p className="help-block">
                        {this.props.help}
                    </p>
                </div>
            </div>
        );
    }
});

var PanelAnalyze = React.createClass({
    render: function() {
        var errors,
            button;

        if (this.props.inputErrors.length > 0) {
            errors = (
                <div className="alert alert-danger" role="alert">
                    Please correct following error(s);
                    <ul>
                        {this.props.inputErrors.map(function (error) {
                            return (
                                <li>{error}</li>
                            );
                        })}
                    </ul>
                </div>
            );
        }

        if (!this.props.disabled) {
            button = (
                <button
                    className="btn btn-primary btn-sm"
                    disabled={this.props.disabled}
                    onClick={this.props.onInputSubmitClick}
                    >
                    <i className="fa fa-send"></i>
                    <span>&nbsp;Submit</span>
                </button>
            );
        } else {
            button = (
                <button
                    className="btn btn-danger btn-sm"
                    disabled={!this.props.disabled}
                    onClick={this.props.onInputCancelClick}
                    >
                    <i className="fa fa-times-circle"></i>
                    <span>&nbsp;Cancel</span>
                </button>
            );
        }

        return (
            <div className="panel panel-info panel-analyze">

                <div className="panel-heading">
                    <h3 className="panel-title">
                        <i className="fa fa-flask"></i>
                        <span>&nbsp;Analyze</span>
                    </h3>
                </div>

                <div className="panel-body panel-body-analyze">
                    <div className="form-horizontal">
                        <PanelAnalyzeBedFile
                            label="BED file"
                            samples={this.props.samples}
                            disabled={this.props.disabled}
                            inputBedFileName={this.props.inputBedFileName}
                            onInputSampleBedFileClick={this.props.onInputSampleBedFileClick}
                            onChange={this.props.onInputBedFileChange}
                        />
                        <PanelAnalyzeCollections
                            label="Collections"
                            options={this.props.collections}
                            help="Hold Ctrl to select multiple gene set collections"
                            disabled={this.props.disabled}
                            onChange={this.props.onSelectCollectionsChange}
                        />
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                {errors}
                                {button}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            );
        }
});

var ResultTitle= React.createClass({
    render: function() {
        return <h3>{this.props.title}</h3>;
    }
});

var ResultSummary = React.createClass({
    render: function() {
        return (
            <div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Cell line</th>
                                <th>Species</th>
                                <th>Disease state</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.props.summary.symbol}</td>
                                <td>{this.props.summary.cellLine}</td>
                                <td>{this.props.summary.species}</td>
                                <td>{this.props.summary.diseaseState}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

var ResultOptions = React.createClass({
    render: function() {
        return (
            <div className="form-inline">
                <div className="form-group">
                    <label className="text-muted">Options</label>
                </div>
                <div className="form-group">
                    <label>Percent &gt;</label>
                    <input
                        type="text"
                        className="form-control input-sm"
                        id={this.props.resultId}
                        value={this.props.options.percent}
                        onChange={this.props.onOptionsPercentChange}
                        />
                </div>
                <div className="form-group">
                    <label>Comb. p-value &lt;</label>
                    <input
                        type="text"
                        className="form-control input-sm"
                        id={this.props.resultId}
                        value={this.props.options.cPValue}
                        onChange={this.props.onOptionsCPValueChange}
                        />
                </div>
            </div>
        );
    }
});

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
        return {
            size: size,
            data: this.props.data.map(function(el) {
                return {
                    // limit axis tick texts to 32 characters
                    n: (el.geneSet.length > 32) ? el.geneSet.substr(0, 29) + '...': el.geneSet,
                    // -Log10 tranformation of p-values
                    // for better visualization
                    val: -Math.log10(el.cPValue)
                };
            }),
            id: this.props.id
        };
    },
    renderChart: function(el, size, data) {
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
            .style("font-size", "10px")
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

        var y = chart.select('.y')
            .call(yAxis);

        y.selectAll("text")
            .style("font-family", "sans-serif")
            .style("font-size", "10px");

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
            .attr("class", "bar")

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
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", -(size.height / 2))
            .attr("dy", "1em")
            .attr("dx", "0.35em")
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .style("text-anchor", "middle")
            .text("-Log10(Comb. p-value)");
        // render the chart
        this.updateChart(el, size, data);
    },
    componentDidMount: function() {
        var el = this.getDOMNode(),
            width = el.parentNode.previousSibling.offsetWidth,
            state = this.getChartState(width);

        window.addEventListener('resize', this.handleResize);
        this.createChart(el, state.size, state.data, state.id);
    },
    componentDidUpdate: function() {
        var el = this.getDOMNode(),
            width = el.parentNode.previousSibling.offsetWidth,
            state = this.getChartState(width);
        this.updateChart(el, state.size, state.data);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    },
    render: function() {
        return (
            <div className="bar-chart"></div>
        );
    }
});

var ResultCollectionTableHeaderSortIcon = React.createClass({
    render: function() {
        var direction = (this.props.direction !== null) ? '-' + this.props.direction: '';
        return (
            <i className={"fa fa-fw fa-sort" + direction}></i>
        );
    }
});

var ResultCollectionTableHeader = React.createClass({
    render: function() {
        var component = this,
            sort = component.props.sort,
            items,
            direction;

        items = component.props.columns.map(function(column) {
            if (column.id == sort.id) {
                direction = sort.direction;
            } else {
                direction = null;
            }
            return (
                <th
                    id={column.id}
                    className="sortable"
                    onClick={component.props.onSortClick}
                    >
                    {column.name}
                    <ResultCollectionTableHeaderSortIcon direction={direction} />
                </th>
            );
        });

        return (
            <thead>
                <tr>
                    {items}
                </tr>
            </thead>
        );
    }
});

var ResultCollectionTableBody = React.createClass({
    render: function() {
        return (
            <tbody>
                {this.props.data.map(function(row) {
                    var geneSet = row.geneSet;
                    if (geneSet.length > 45) {
                        geneSet = <abbr title={geneSet}>{geneSet.substr(0, 45)}</abbr>;
                    }
                    return (
                        <tr>
                            <td>{geneSet}</td>
                            <td>
                                <abbr
                                    title={row.overlapSize + "/" + row.geneSetSize}
                                    >
                                    {row.percent}
                                </abbr>
                            </td>
                            <td>{row.fPValue.toPrecision(3)}</td>
                            <td>{row.fPValueCorr.toPrecision(3)}</td>
                            <td>{row.gSPValue.toPrecision(3)}</td>
                            <td>{row.cPValue.toPrecision(3)}</td>
                        </tr>
                    );
                })}
            </tbody>
        );
    }
});

var ResultCollectionTable = React.createClass({
    getInitialState: function() {
        return {
            sort: {
                id: 'cPValue',
                direction: 'asc'
            },
            columns: [
                {id: 'geneSet' , name: 'Gene set'},
                {id: 'percent', name: '%'},
                {id: 'fPValue', name: 'Func. p-value'},
                {id: 'fPValueCorr', name: 'Func. p-value corr.'},
                {id: 'gSPValue', name: 'G. set p-value'},
                {id: 'cPValue', name: 'Comb. p-value'}
            ]
        };
    },
    handleSortClick: function(e) {
        var id = e.currentTarget.id,
            sort = this.state.sort;
        // new sort object
        var _sort = {
            id: id,
            direction: (sort.direction == 'asc') ? 'desc': 'asc'
        };
        // replace sort with the new sort object
        this.setState({
            sort: _sort
        });
    },
    render: function() {
        var component = this,
            data = component.props.data,
            sort = component.state.sort,
            columns = component.state.columns;
        // sort data according to sort object in the state
        data = data.sort(function(a, b) {
            return (sort.direction == 'asc') ? a[sort.id] - b[sort.id]: b[sort.id] - a[sort.id];
        });
        // is there any data?
        if (data.length > 0) {
            return (
                <div className="table-responsive table-responsive-panel">
                    <table className="table table-striped table-hover table-panel">
                        <ResultCollectionTableHeader
                            columns={columns}
                            sort={sort}
                            onSortClick={component.handleSortClick}
                            />
                        <ResultCollectionTableBody
                            data={data}
                            />
                    </table>
                </div>
            );
        } else {
            return (
                <div className="panel-body">
                    No significant results available.
                </div>
            )
        }
    }
});

var ResultCollection = React.createClass({
    render: function() {
        var component = this,
            collection = component.props.collection,
            uniqueId = component.props.resultId + '__' + collection.id,
            data = collection.data.filter(function(item) {
                return item.percent > component.props.options.percent &&
                       item.cPValue < component.props.options.cPValue;
            }),
            exportButtons,
            barChart;
        // is there any data?
        if (data.length > 0) {
            exportButtons = (
                <div className="col-xs-4 text-right">
                    <span className="hidden-xs">Export&nbsp;</span>
                    <button
                        className="btn btn-default btn-xs"
                        id={uniqueId}
                        onClick={component.props.onExportBarChartClick}
                        title="Export bar chart as SVG"
                        >
                        <i className="fa fa-bar-chart fa-fw"></i>
                    </button>
                    &nbsp;
                    <button
                        className="btn btn-default btn-xs"
                        id={uniqueId}
                        onClick={component.props.onExportTableClick}
                        title="Export table as TSV"
                        >
                        <i className="fa fa-table fa-fw"></i>
                    </button>
                </div>
            );
            barChart = (
                <ResultCollectionBarChart
                    id={uniqueId}
                    data={data}
                    />
            );
        }
        return (
            <div className="panel panel-primary">
                <div className="panel-heading" role="tab" id={'heading-' + uniqueId}>
                    <div className="row flex-align flex-align-center">
                        <div className="col-xs-8">
                            <h4 className="panel-title">
                                <span className="badge">{data.length}</span>
                                &nbsp;
                                <a
                                    className="collapsed"
                                    role="button"
                                    data-toggle="collapse"
                                    href={'#collapse-' + uniqueId}
                                    aria-expanded="true"
                                    aria-controls={'collapse-' + uniqueId}
                                    >
                                    {collection.title}
                                </a>
                            </h4>
                        </div>
                        {exportButtons}
                    </div>
                </div>
                <div
                    id={'collapse-' + uniqueId}
                    className="panel-collapse collapse"
                    role="tabpanel"
                    aria-labelledby={'heading-' + uniqueId}
                    >
                    {barChart}
                    <ResultCollectionTable
                        collection={collection}
                        data={data}
                        />
                </div>
            </div>
        );
    }
});

var Result = React.createClass({
    render: function() {
        var component = this,
            summary,
            options;

        if (component.props.result.summary != null) {
            summary = (
                <ResultSummary
                    summary={component.props.result.summary}
                    />
            );
        }

        if (component.props.result.collections.length > 0) {
            options = (
                <ResultOptions
                    resultId={component.props.result.id}
                    options={component.props.result.options}
                    onOptionsPercentChange={component.props.onOptionsPercentChange}
                    onOptionsCPValueChange={component.props.onOptionsCPValueChange}
                    />
            );
        }

        return (
            <div>
                <ResultTitle
                    title={component.props.result.title}
                    />
                {summary}
                {options}
                <div className="panel-group" aria-multiselectable="true">
                    {component.props.result.collections.map(function(collection) {
                          return (
                                <ResultCollection
                                    resultId={component.props.result.id}
                                    collection={collection}
                                    options={component.props.result.options}
                                    onExportBarChartClick={component.props.onExportBarChartClick}
                                    onExportTableClick={component.props.onExportTableClick}
                                    />
                          );
                    })}
                </div>
            </div>
        );
    }
});

var ResultGroupCompareCollections = React.createClass({
    componentDidMount: function() {
        var component = this;
        var $node = $(component.getDOMNode());

        $node.find('select').multiselect({
            buttonClass: 'btn btn-default btn-xs',
            includeSelectAllOption: true,
            numberDisplayed: 1,
            onChange: component.props.onCompareCollectionsChange,
            onSelectAll: component.props.onCompareCollectionsChange
        });
    },
    render: function() {
        return (
            <div>
                <span className="hidden-xs">Collections&nbsp;</span>
                <select
                    className="form-control"
                    multiple="multiple">

                    {this.props.options.map(function (option) {
                        return (
                            <option
                                value={option.id}
                                selected={option.selected}>
                                {option.name}
                            </option>
                        );
                    })}

                </select>
            </div>
        );
    }
});

var ResultGroupTitle = React.createClass({
    render: function() {
        var title = (this.props.compare) ? 'Compare' : 'View',
            toggle = (this.props.compare) ? 'toggle-on' : 'toggle-off',
            compareCollections,
            compareExport;

        if (this.props.compare) {
            compareCollections = (
                <li>
                    <ResultGroupCompareCollections
                        options={this.props.collections}
                        onCompareCollectionsChange={this.props.onCompareCollectionsChange}
                        />
                </li>
            );
            compareExport = (
                <li>
                    <button
                        className="btn btn-default btn-xs"
                        title="Export as SVG"
                        onClick={this.props.onCompareExportClick}>
                        <i className="fa fa-external-link fa-fw"></i>
                        <span className="hidden-xs">&nbsp;Export</span>
                    </button>
                </li>
            );
        }

        return (
            <div className="row flex-align">
                <div className="col-xs-3 flex-align-bottom">
                    <h2>{title}</h2>
                </div>
                <div className="col-xs-9 text-right flex-align-bottom">
                    <ul className="list-inline list-inline-options">
                        {compareCollections}
                        {compareExport}
                        <li>
                            <button
                                className="btn btn-default btn-xs"
                                title="Clear results"
                                onClick={this.props.onResultsClearClick}>
                                <i className="fa fa-trash fa-fw"></i>
                                <span className="hidden-xs">&nbsp;Clear</span>
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-default btn-xs"
                                title="Toggle view/compare"
                                onClick={this.props.onResultsCompareClick}>
                                <i className={"fa fa-" + toggle + " fa-fw"}></i>
                                <span className="hidden-xs">&nbsp;Compare</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
});

var ResultGroupProgressBar = React.createClass({
    render: function() {
        if (this.props.show) {
            var barStyle = {
                minWidth: "2em",
                width: this.props.progress + "%"
            };

            return (
                <div className="progress">
                    <div
                        className="progress-bar progress-bar-info progress-bar-striped active"
                        role="progressbar"
                        aria-valuenow={this.props.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={barStyle}
                        >
                        {this.props.progress + "%"}
                    </div>
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }
});

var ResultGroupBubbleChart = React.createClass({
    handleResize: function() {
        this.forceUpdate();
    },
    getChartState: function(width) {
        var component = this,
            margin = {top: 150, right: 20, bottom: 20, left: 225},
            collections = this.props.collections.filter(function(collection) {
                return collection.selected === true;
            }).map(function(collection) {
                return collection.id;
            }),
            data = [];

        component.props.results.forEach(function(result) {
            result.collections.forEach(function(collection) {
                if (collections.indexOf(collection.id) !== -1) {
                    collection.data.forEach(function(row) {
                        if (row.cPValue < result.options.cPValue && row.percent > result.options.percent) {
                            data.push({
                                sample: (result.title.length > 21) ? result.title.substr(0, 18) + '...': result.title,
                                geneSet: (row.geneSet.length > 32) ? row.geneSet.substr(0, 29) + '...': row.geneSet,
                                cPValue: row.cPValue
                            });
                        }
                    });
                }
            });
        });

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

        var height = (size.height > 0 ) ? size.height + size.margin.top + size.margin.bottom: 0;

        var chart = d3.select(el)
            .select("svg")
            .attr("width", size.width + size.margin.left + size.margin.right)
            .attr("height", height)
            .select(".chart");

        var x = chart.select(".x")
            .call(xAxis);

        x.selectAll("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges");

        x.selectAll("line")
            .attr("transform", "translate(0,-6)")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")
            .style("opacity", 0.2);

        x.selectAll("text")
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .style("text-anchor", "start")
            .attr("dx", "1em")
            .attr("dy", "0.35em")
            .attr("transform", "rotate(-75)");

        var y = chart.select(".y")
            .call(yAxis);

        y.selectAll("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges");

        y.selectAll("line")
            .attr("transform", "translate(-6,0)")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")
            .style("opacity", 0.2);

        y.selectAll("text")
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "0.35em");

        var bubble = chart.select('.bubbles')
            .selectAll(".bubble")
            .data(data);

        bubble.enter().append("circle")
            .attr("class", "bubble");

        bubble
            .attr("r", function(d) {
                return -Math.log10(d.cPValue);
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
        chart.append("g").attr("class", "x axis");
        chart.append("g").attr("class", "y axis");
        chart.append("g").attr("class", "bubbles");
        // render the chart
        this.updateChart(el, size, data);
    },
    componentDidMount: function() {
        var el = this.getDOMNode(),
            width = el.offsetWidth,
            state = this.getChartState(width);

        window.addEventListener('resize', this.handleResize);
        this.createChart(el, state.size, state.data);
    },
    componentDidUpdate: function() {
        var el = this.getDOMNode(),
            width = el.offsetWidth,
            state = this.getChartState(width);

        this.updateChart(el, state.size, state.data);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    },
    render: function() {
        return (
            <div className="bubble-chart"></div>
        );
    }
});

var ResultGroup = React.createClass({
    render: function() {
        var component = this,
            view;

        if (component.props.results.length > 0) {
            if (component.props.compare) {
                view = (
                    <ResultGroupBubbleChart
                        results={component.props.results}
                        collections={component.props.collections}
                        />
                );
            } else {
                view = component.props.results.map(function(result) {
                    return (
                        <div>
                            <Result
                                result={result}
                                progress={component.props.progress}
                                isRunning={component.props.isRunning}
                                onOptionsPercentChange={component.props.onOptionsPercentChange}
                                onOptionsCPValueChange={component.props.onOptionsCPValueChange}
                                onExportBarChartClick={component.props.onExportBarChartClick}
                                onExportTableClick={component.props.onExportTableClick}
                                />
                            <hr/>
                        </div>
                    );
                });
            }

            return (
                <div>
                    <ResultGroupTitle
                        compare={component.props.compare}
                        collections={component.props.collections}
                        onCompareCollectionsChange={component.props.onCompareCollectionsChange}
                        onCompareExportClick={component.props.onCompareExportClick}
                        onResultsClearClick={component.props.onResultsClearClick}
                        onResultsCompareClick={component.props.onResultsCompareClick}
                        />
                    <hr />
                    <ResultGroupProgressBar
                        progress={component.props.progress}
                        show={component.props.isRunning}
                        />
                    {view}
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }
});

var SetenApp = React.createClass({
    getInitialState: function() {
        return {
                inputBedFile: undefined,
                inputBedFileName: '',
                inputCollections: undefined,
                inputErrors: [],
                workers: [],
                geneScores: [],
                geneCollections: [],
                results: [],
                collections: this.props.collections,
                compare: false,
                runningResult: undefined,
                isRunning: false
            };
    },
    statics: {
        getDefaultResultOptions: function() {
            return {
                percent: 5,
                cPValue: 0.01
            };
        },
        getIdFromFileName: function(fileName) {
            return fileName.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
        }
    },
    resetSomeState: function() {
        // reset some state variables
        this.setState({workers: []});
        this.setState({geneScores: []});
        this.setState({geneCollections: []});
        this.setState({runningResult: undefined});
    },
    togglePanelAnalyze: function(e) {
        this.setState({isRunning: !this.state.isRunning});
    },
    cancelAnalysis: function() {
        var workers = this.state.workers,
            results = this.state.results,
            runningResult = this.state.runningResult,
            l = results.length;

        // terminate all available workers
        workers.forEach(function(worker) {
            worker.terminate();
        });
        this.setState({results: results});
        // delete cancelled result from results
        while (l--) {
            if (results[l].id == runningResult.id) {
                results.splice(l, 1);
                break;
            }
        }
        // reset some state variables
        this.resetSomeState();
        // enable the panel back
        this.togglePanelAnalyze();
    },
    completeAnalysis: function() {
        var workers = this.state.workers;

        // terminate all available workers
        workers.forEach(function(worker) {
            worker.terminate();
        });
        // reset some state variables
        this.resetSomeState();
        // enable the panel back
        this.togglePanelAnalyze();
    },
    handleCompareCollectionsChange: function(e) {
        var selection = e,
            collections = this.state.collections;
        // select all is checked/unchecked or
        // user checked/unchecked all one by one
        if (selection === true || selection === false) {
            collections = collections.map(function(collection) {
                collection.selected = selection;
                return collection;
            });
        } else {
            // single option is checked or unchecked
            var option = selection.get(0);

            collections = collections.map(function(collection) {
                if (collection.id == option.value) {
                    collection.selected = !collection.selected;
                }
                return collection;
            });
        }

        this.setState({collections: collections});
    },
    handleCompareExportClick: function(e) {
        e.preventDefault();
        var id = 'bubble-chart',
            svg = document.querySelector('svg#' + id),
            a = document.createElement('a');

        if (svg.outerHTML.length > 0) {
            var data = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
            a.href = window.URL.createObjectURL(data);
            a.setAttribute('download', id + '.svg');
            a.dispatchEvent(clickEvent);
            a.remove();
        }
    },
    handleResultsClearClick: function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to clear all results?')) {
            this.setState({results: []});
            this.setState({compare: false});
        }
    },
    handleResultsCompareClick: function(e) {
        e.preventDefault();
        this.setState({compare: !this.state.compare});
    },
    handleExploreViewClick: function(e) {
        e.preventDefault();
        var resultId = e.currentTarget.id,
            exploreWorker = new Worker('assets/js/workers/explore.js');

        exploreWorker.postMessage({resultId: resultId, collections: this.state.collections});
        exploreWorker.onmessage = this.exploreWorkerOnMessage;
    },
    handleInputSampleBedFileClick: function(e) {
        e.preventDefault();
        var sample = e.currentTarget.id,
            sampleWorker = new Worker('assets/js/workers/sample.js');

        sampleWorker.postMessage(sample);
        sampleWorker.onmessage = this.sampleWorkerOnMessage;
    },
    handleInputBedFileChange: function(e) {
        var file = e.target.files[0];
        this.setState({inputBedFile: file});
        this.setState({inputBedFileName: file.name});
    },
    handleSelectCollectionsChange: function(e) {
        var options = e.target.options,
            n = e.target.options.length,
            i = 0,
            collections = [];

        while (i < n) {
            if (options[i].selected) {
                collections.push({
                    id: options[i].value,
                    filename: options[i].id,
                    name: options[i].text
                });
            }
            i++;
        }
        if (!collections.length) {
            collections = undefined;
        }
        this.setState({inputCollections: collections});
    },
    handleInputSubmitClick: function(e) {
        e.preventDefault();
        var bedFile = this.state.inputBedFile,
            collections = this.state.inputCollections,
            errors = [];

        if (bedFile === undefined) {
            errors.push('You should select a BED file');
        }
        if (collections === undefined) {
            errors.push('You should select at least one gene set collection');
        }
        if (errors.length > 0) {
            // push errors to the state
            this.setState({inputErrors: errors});
        } else {
            var mappingWorker = new Worker('assets/js/workers/mapping.js'),
                results = this.state.results,
                runningResult = {
                    id: this.constructor.getIdFromFileName(this.state.inputBedFileName),
                    title: this.state.inputBedFileName,
                    summary: null,
                    options: this.constructor.getDefaultResultOptions(),
                    collections: []
                };

            // remove previous errors from the state
            this.setState({inputErrors: []});
            // toggle form
            this.togglePanelAnalyze();
            // initiate a running result variable
            results.unshift(runningResult);
            this.setState({results: results});
            this.setState({runningResult: runningResult});
            // start mapping worker to read and map the file
            mappingWorker.postMessage(bedFile);
            mappingWorker.onmessage = this.mappingWorkerOnMessage;
            // add worker to the state
            this.setState({workers: this.state.workers.concat([mappingWorker])});
        }
    },
    handleInputCancelClick: function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to cancel this analysis?')) {
            this.cancelAnalysis();
        }
    },
    handleOptionsPercentChange: function(e) {
        var percent = e.target.value,
            resultId = e.target.id,
            results = this.state.results;

        results = results.map(function(result) {
            if (result.id == resultId) {
                result.options.percent = percent;
            }
            return result;
        });

        this.setState({results: results});
    },
    handleOptionsCPValueChange: function(e) {
        var cPValue = e.target.value,
            resultId = e.target.id,
            results = this.state.results;

        results = results.map(function(result) {
            if (result.id == resultId) {
                result.options.cPValue = cPValue;
            }
            return result;
        });

        this.setState({results: results});
    },
    handleExportBarChartClick: function(e) {
        e.preventDefault();
        var id = e.currentTarget.id,
            svg = document.querySelector('svg#' + id),
            a = document.createElement('a');

        if (svg.outerHTML.length > 0) {
            var data = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
            a.href = window.URL.createObjectURL(data);
            a.setAttribute('download', id + '.svg');
            a.dispatchEvent(clickEvent);
            a.remove();
        }
    },
    handleExportTableClick: function(e) {
        e.preventDefault();
        var id = e.currentTarget.id,
            resultId = id.split('__')[0],
            collId = id.split('__')[1],
            results = this.state.results,
            result,
            collection;

        result = results.filter(function(result) {
            return result.id == resultId;
        })[0];

        collection = result.collections.filter(function(coll) {
            return coll.id = collId;
        })[0];

        var tsv = [
            'Gene set',
            'Genes',
            'Overlap size',
            'Gene set size',
            '%',
            'Func. p-value',
            'Func. p-value corr.',
            'G. set p-value',
            'Comb. p-value'
        ].join('\t') + '\n';
        collection.data.forEach(function(row) {
            tsv += [
                row.geneSet,
                row.genes.join(', '),
                row.overlapSize,
                row.geneSetSize,
                row.percent,
                row.fPValue,
                row.fPValueCorr,
                row.gSPValue,
                row.cPValue
            ].join('\t') + '\n';
        });
        var data = new Blob([tsv], {type: 'text/tsv'});
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(data);
        a.setAttribute('download', id + '.tsv');
        a.dispatchEvent(clickEvent);
        a.remove();
    },
    exploreWorkerOnMessage: function(e) {
        var component = this,
            results = component.state.results,
            result = e.data;
        // add missing result attributes
        result['summary'] = component.props.explore.filter(function(item) {
            return item.id == result.id;
        })[0];
        result['title'] = result.summary.symbol + ' / ' + result.summary.cellLine;
        result['options'] = component.constructor.getDefaultResultOptions();
        // add the complete result to the results in the state
        results.unshift(result);
        component.setState({results: results});
    },
    sampleWorkerOnMessage: function(e) {
        this.setState({inputBedFile: e.data.file});
        this.setState({inputBedFileName: e.data.name});
    },
    mappingWorkerOnMessage: function(e) {
        var geneScores = e.data,
            collections = this.props.collections,
            collectionWorker;

        // store gene scores in the state
        this.setState({geneScores: geneScores});
        // collect all collections
        collectionWorker = new Worker('assets/js/workers/collection.js');
        collectionWorker.postMessage(collections);
        collectionWorker.onmessage = this.collectionWorkerOnMessage;
        // add worker to the state
        this.setState({workers: this.state.workers.concat([collectionWorker])});
    },
    collectionWorkerOnMessage: function(e) {
        var component = this,
            inputCollections = component.state.inputCollections,
            geneScores = component.state.geneScores,
            geneCollections = e.data,
            enrichmentWorker;

        // store gene collections in the state
        component.setState({geneCollections: geneCollections});

        // start an enrichment worker for each collection
        inputCollections.forEach(function(inputCollection) {
            enrichmentWorker = new Worker('assets/js/workers/enrichment.js')
            enrichmentWorker.postMessage({
                'geneScores': geneScores,
                'geneCollection': geneCollections.collections[inputCollection.id],
                'geneCollectionsSize': geneCollections.size
            });
            enrichmentWorker.onmessage = component.enrichmentWorkerOnMessage;
            // add worker to the state
            component.setState({workers: component.state.workers.concat([enrichmentWorker])});
        });
    },
    enrichmentWorkerOnMessage: function(e) {
        var currColl = e.data,
            results = this.state.results,
            runningResult = this.state.runningResult;
        // add current collection to the running result in the state
        runningResult.collections.push(currColl);
        // update running result in results in the state
        this.setState({results: results.map(function(result) {
            // update the running result element in results
            if (result.id == runningResult.id) {
                result = runningResult;
            }
            return result;
        })});
        // check if job is complete
        if (runningResult.collections.length == this.state.inputCollections.length) {
            this.completeAnalysis();
        }
    },
    render: function() {
        var progress;
        if (this.state.runningResult !== undefined && this.state.inputCollections !== undefined) {
            progress = Math.round(
                (this.state.runningResult.collections.length/this.state.inputCollections.length)*100);
        }
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        <PanelExplore
                            explore={this.props.explore}
                            onExploreSearchChange={this.handleExploreSearchChange}
                            onExploreViewClick={this.handleExploreViewClick}
                            onExploreCompareClick={this.handleExploreCompareClick}
                            />
                    </div>
                    <div className="col-sm-8">
                        <PanelAnalyze
                            collections={this.props.collections}
                            samples={this.props.samples}
                            disabled={this.state.isRunning}
                            inputBedFileName={this.state.inputBedFileName}
                            inputErrors={this.state.inputErrors}
                            onInputBedFileChange={this.handleInputBedFileChange}
                            onInputSampleBedFileClick={this.handleInputSampleBedFileClick}
                            onSelectCollectionsChange={this.handleSelectCollectionsChange}
                            onInputSubmitClick={this.handleInputSubmitClick}
                            onInputCancelClick={this.handleInputCancelClick}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <ResultGroup
                            results={this.state.results}
                            collections={this.props.collections}
                            compare={this.state.compare}
                            progress={progress}
                            isRunning={this.state.isRunning}
                            onCompareCollectionsChange = {this.handleCompareCollectionsChange}
                            onCompareExportClick = {this.handleCompareExportClick}
                            onResultsClearClick = {this.handleResultsClearClick}
                            onResultsCompareClick = {this.handleResultsCompareClick}
                            onOptionsPercentChange={this.handleOptionsPercentChange}
                            onOptionsCPValueChange={this.handleOptionsCPValueChange}
                            onExportBarChartClick={this.handleExportBarChartClick}
                            onExportTableClick={this.handleExportTableClick}
                            />
                    </div>
                </div>
            </div>
        );
    }
});

var collections = [
    {id: 'reactome', filename: 'c2.cp.reactome.v5.0.symbols', name: 'Pathways: REACTOME', selected: false},
    {id: 'biocarta', filename: 'c2.cp.biocarta.v5.0.symbols', name: 'Pathways: BIOCARTA', selected: false},
    {id: 'kegg', filename: 'c2.cp.kegg.v5.0.symbols', name: 'Pathways: KEGG', selected: false},
    {id: 'bp', filename: 'c5.bp.v5.0.symbols', name: 'GO: Biological Process', selected: false},
    {id: 'mf', filename: 'c5.mf.v5.0.symbols', name: 'GO: Molecular Function', selected: false},
    {id: 'cc', filename: 'c5.cc.v5.0.symbols', name: 'GO: Cellular Component', selected: false},
    {id: 'hpo', filename: 'cx.hpo.v5.0.symbols', name: 'Human Phenotype Ontology', selected: false},
    {id: 'malacards', filename: 'cx.malacards.v5.0.symbols', name: 'MalaCards Disease Ontology', selected: true}
];

var samples = [
    {id: "FIP1L1_HEK293", symbol: "FIP1L1", name: "FIP1L1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "PRPF8_K562_ENCSR534YOI", symbol: "PRPF8", diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: "K562", species: "Human"},
];

var explore = [
    {id: "clipdb-AGO1_HEK293", symbol: "AGO1", name: "AGO1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-AGO2_LCL35", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL35", species: "Human"},
    {id: "clipdb-AGO2_LCL-BAC-D2", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL-BAC-D2", species: "Human"},
    {id: "clipdb-AGO2_LCL-BAC-D3", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL-BAC-D3", species: "Human"},
    {id: "clipdb-AGO2_BCBL-1", symbol: "AGO2", name: "AGO2", diseaseState: "Primary effusion lymphoma", cellLine: "BCBL-1", species: "Human"},
    {id: "clipdb-AGO2_LCL-BAC", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL-BAC", species: "Human"},
    {id: "clipdb-AGO2_EF3D-AGO2", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "EF3D-AGO2", species: "Human"},
    {id: "clipdb-AGO2_HeLa", symbol: "AGO2", name: "AGO2", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-AGO2_BC-1", symbol: "AGO2", name: "AGO2", diseaseState: "Primary effusion lymphoma", cellLine: "BC-1", species: "Human"},
    {id: "clipdb-AGO2_HEK293S", symbol: "AGO2", name: "AGO2", diseaseState: "Cancer", cellLine: "HEK293S", species: "Human"},
    {id: "clipdb-AGO2_BC-3", symbol: "AGO2", name: "AGO2", diseaseState: "Primary effusion lymphoma", cellLine: "BC-3", species: "Human"},
    {id: "clipdb-AGO2_HEK293", symbol: "AGO2", name: "AGO2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-AGO2_LCL-BAC-D1", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL-BAC-D1", species: "Human"},
    {id: "clipdb-AGO3_HEK293", symbol: "AGO3", name: "AGO3", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-AGO4_HEK293", symbol: "AGO4", name: "AGO4", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-ALKBH5_HEK293", symbol: "ALKBH5", name: "ALKBH5", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-C17orf85_HEK293", symbol: "C17orf85", name: "C17orf85", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CAPRIN1_HEK293", symbol: "CAPRIN1", name: "CAPRIN1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CPSF1_HEK293", symbol: "CPSF1", name: "CPSF1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CPSF2_HEK293", symbol: "CPSF2", name: "CPSF2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CPSF3_HEK293", symbol: "CPSF3", name: "CPSF3", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CPSF4_HEK293", symbol: "CPSF4", name: "CPSF4", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CPSF6_HEK293", symbol: "CPSF6", name: "CPSF6", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CPSF7_HEK293", symbol: "CPSF7", name: "CPSF7", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CSTF2_HeLa", symbol: "CSTF2", name: "CSTF2", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-CSTF2_HEK293", symbol: "CSTF2", name: "CSTF2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-CSTF2T_HEK293", symbol: "CSTF2T", name: "CSTF2T", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-DGCR8_HEK293T", symbol: "DGCR8", name: "DGCR8", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human"},
    {id: "clipdb-EIF4A3_HeLa", symbol: "EIF4A3", name: "EIF4A3", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-ELAVL1_HEK293", symbol: "ELAVL1", name: "ELAVL1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-ELAVL1_HeLa", symbol: "ELAVL1", name: "ELAVL1", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-EZH2_HCT116", symbol: "EZH2", name: "EZH2", diseaseState: "Colorectal adenocarcinoma", cellLine: "HCT116", species: "Human"},
    {id: "clipdb-FBL_HEK293", symbol: "FBL", name: "FBL", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-FIP1L1_HEK293", symbol: "FIP1L1", name: "FIP1L1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-FMR1_HEK293", symbol: "FMR1", name: "FMR1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-FXR1_HEK293", symbol: "FXR1", name: "FXR1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-FXR2_HEK293", symbol: "FXR2", name: "FXR2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-HNRNPA1_HEK293T", symbol: "HNRNPA1", name: "HNRNPA1", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human"},
    {id: "clipdb-HNRNPA2B1_HEK293T", symbol: "HNRNPA2B1", name: "HNRNPA2B1", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human"},
    {id: "clipdb-HNRNPC_HeLa", symbol: "HNRNPC", name: "HNRNPC", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-HNRNPF_HEK293T", symbol: "HNRNPF", name: "HNRNPF", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human"},
    {id: "clipdb-HNRNPH_HEK293T", symbol: "HNRNPH1", name: "HNRNPH1", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human"},
    {id: "clipdb-HNRNPM_HEK293T", symbol: "HNRNPM", name: "HNRNPM", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human"},
    {id: "clipdb-HNRNPU_HEK293T", symbol: "HNRNPU", name: "HNRNPU", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human"},
    {id: "clipdb-HNRNPU_HeLa", symbol: "HNRNPU", name: "HNRNPU", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-IGF2BP1_HEK293", symbol: "IGF2BP1", name: "IGF2BP1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-IGF2BP2_HEK293", symbol: "IGF2BP2", name: "IGF2BP2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-IGF2BP3_HEK293", symbol: "IGF2BP3", name: "IGF2BP3", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-LIN28A_HEK293", symbol: "LIN28A", name: "LIN28A", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-LIN28A_H9", symbol: "LIN28A", name: "LIN28A", diseaseState: "Normal", cellLine: "H9", species: "Human"},
    {id: "clipdb-LIN28B_HEK293", symbol: "LIN28B", name: "LIN28B", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-MOV10_HEK293", symbol: "MOV10", name: "MOV10", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-NOP56_HEK293", symbol: "NOP56", name: "NOP56", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-NOP58_HEK293", symbol: "NOP58", name: "NOP58", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-NUDT21_HEK293", symbol: "NUDT21", name: "NUDT21", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-PTBP1PTBP2_HeLa", symbol: "PTBP1/PTBP2", name: "PTBP1/PTBP2", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-PUM2_HEK293", symbol: "PUM2", name: "PUM2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-QKI_HEK293", symbol: "QKI", name: "QKI", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-RTCB_HEK293", symbol: "RTCB", name: "RTCB", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-TARDBP_SH-SY5Y", symbol: "TARDBP", name: "TARDBP", diseaseState: "Metastatic neuroblastoma", cellLine: "SH-SY5Y", species: "Human"},
    {id: "clipdb-TARDBP_H9", symbol: "TARDBP", name: "TARDBP", diseaseState: "Normal", cellLine: "H9", species: "Human"},
    {id: "clipdb-TIA1_HeLa", symbol: "TIA1", name: "TIA1", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-TIAL1_HeLa", symbol: "TIAL1", name: "TIAL1", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-TNRC6A_HEK293", symbol: "TNRC6A", name: "TNRC6A", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-TNRC6B_HEK293", symbol: "TNRC6B", name: "TNRC6B", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-TNRC6C_HEK293", symbol: "TNRC6C", name: "TNRC6C", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "clipdb-YTHDF2_HeLa", symbol: "YTHDF2", name: "YTHDF2", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human"},
    {id: "clipdb-ZC3H7B_HEK293", symbol: "ZC3H7B", name: "ZC3H7B", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: 'encode-AUH_HepG2_ENCSR334QFR', symbol: 'AUH', name: 'AUH', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-AUH_K562_ENCSR541QHS', symbol: 'AUH', name: 'AUH', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-BCCIP_HepG2_ENCSR485QCG', symbol: 'BCCIP', name: 'BCCIP', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-CPSF6_K562_ENCSR532VUB', symbol: 'CPSF6', name: 'CPSF6', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-DDX42_K562_ENCSR576SHT', symbol: 'DDX42', name: 'DDX42', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-EIF4G1_K562_ENCSR961WWI', symbol: 'EIF4G1', name: 'EIF4G1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-EIF4G2_K562_ENCSR307YIW', symbol: 'EIF4G2', name: 'EIF4G2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-FKBP4_HepG2_ENCSR018ZUE', symbol: 'FKBP4', name: 'FKBP4', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-FMR1_K562_ENCSR331VNX', symbol: 'FMR1', name: 'FMR1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-FUS_K562_ENCSR477TRN', symbol: 'FUS', name: 'FUS', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-HNRNPA1_HepG2_ENCSR769UEW', symbol: 'HNRNPA1', name: 'HNRNPA1', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-HNRNPA1_K562_ENCSR154HRN', symbol: 'HNRNPA1', name: 'HNRNPA1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-HNRNPM_HepG2_ENCSR267UCX', symbol: 'HNRNPM', name: 'HNRNPM', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-HNRNPM_K562_ENCSR412NOW', symbol: 'HNRNPM', name: 'HNRNPM', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-HNRNPU_HepG2_ENCSR240MVJ', symbol: 'HNRNPU', name: 'HNRNPU', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-HNRNPU_K562_ENCSR520BZQ', symbol: 'HNRNPU', name: 'HNRNPU', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-IGF2BP1_HepG2_ENCSR744GEU', symbol: 'IGF2BP1', name: 'IGF2BP1', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-IGF2BP1_K562', symbol: 'IGF2BP1', name: 'IGF2BP1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-IGF2BP2_K562', symbol: 'IGF2BP2', name: 'IGF2BP2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-IGF2BP3_HepG2_ENCSR993OLA', symbol: 'IGF2BP3', name: 'IGF2BP3', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-IGF2BP3_K562_ENCSR096IJV', symbol: 'IGF2BP3', name: 'IGF2BP3', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-LARP7_K562_ENCSR456KXI', symbol: 'LARP7', name: 'LARP7', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-PRPF8_K562_ENCSR534YOI', symbol: 'PRPF8', name: 'PRPF8', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-RBFOX2_HepG2_ENCSR987FTF', symbol: 'RBFOX2', name: 'RBFOX2', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-SAFB2_K562_ENCSR943MHU', symbol: 'SAFB2', name: 'SAFB2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-SLBP_K562_ENCSR483NOP', symbol: 'SLBP', name: 'SLBP', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-SLTM_K562_ENCSR000SSH', symbol: 'SLTM', name: 'SLTM', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-SRSF9_HepG2_ENCSR773KRC', symbol: 'SRSF9', name: 'SRSF9', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-TIA1_HepG2_ENCSR623VEQ', symbol: 'TIA1', name: 'TIA1', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-TIAL1_K562_ENCSR441YTO', symbol: 'TIAL1', name: 'TIAL1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-TRA2A_HepG2_ENCSR314UMJ', symbol: 'TRA2A', name: 'TRA2A', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human"},
    {id: 'encode-TRA2A_K562_ENCSR365NVO', symbol: 'TRA2A', name: 'TRA2A', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-U2AF1_K562_ENCSR862QCH', symbol: 'U2AF1', name: 'U2AF1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-U2AF2_K562_ENCSR893RAV', symbol: 'U2AF2', name: 'U2AF2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
    {id: 'encode-XRN2_K562_ENCSR657TZB', symbol: 'XRN2', name: 'XRN2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"}
];

ReactDOM.render(
    <SetenApp
        collections={collections}
        samples={samples}
        explore={explore}
        />,
    document.querySelector('.container-app')
);
