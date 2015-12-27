'use strict';

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
    componentDidMount: function(argument) {
        var item = this.getDOMNode();

        $(item).popover({
            trigger: 'hover',
            placement: 'auto',
            html: true,
            delay: {show: 50, hide: 100}
        });
    },
    render: function() {
        var item = this.props.item,
            dataContent = [
                '<p><strong>Symbol:</strong> ' + item.symbol + '</p>',
                '<p><strong>Cell line:</strong> ' + item.cellLine + '</p>',
                '<p><strong>Species:</strong> ' + item.species + '</p>',
                '<p><strong>Disease state:</strong> ' + item.diseaseState + '</p>'
            ].join('');
        return (
            <a
                href="#"
                className="list-group-item"
                id={item.id}
                title={item.symbol + ' (' + item.cellLine + ') '}
                data-content={dataContent}
                onClick={this.props.onExplore}
                >
                {item.symbol} ({item.cellLine})
            </a>
        );
    }
});

var PanelExplore = React.createClass({
    render: function() {
        var component = this;
        var clipdb = this.props.explore.clipdb;
        var encode = this.props.explore.encode;
        return (
            <div className="panel panel-info panel-explore">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        <i className="fa fa-globe"></i>
                        &nbsp;
                        Explore
                    </h3>
                </div>

                <div className="list-group list-group-explore">
                    <div className="list-group-item">
                        <h4 className="list-group-item-heading">CLIPdb</h4>
                        <p className="list-group-item-text">
                            Precomputed gene set associations for RBPs from CLIPdb project.
                            </p>
                    </div>
                    {clipdb.map(function(item) {
                        return (
                            <PanelExploreItem
                                item={item}
                                onExplore={component.props.onExplore}
                                />
                        );
                    })}
                    <div className="list-group-item">
                        <h4 className="list-group-item-heading">ENCODE</h4>
                        <p className="list-group-item-text">
                            Precomputed gene set associations for RBPs from ENCODE project.
                        </p>
                    </div>
                    {encode.map(function(item) {
                        return (
                            <PanelExploreItem
                                item={item}
                                onExplore={component.props.onExplore}
                                />
                        );
                    })}
                </div>
            </div>
        );
    }
});

var InputBedFile = React.createClass({
    componentDidMount: function(argument) {
        var el = this.getDOMNode(),
            buttons = el.querySelectorAll('.btn-explore');

        [].forEach.call(buttons, function(button) {
            $(button).popover({
                trigger: 'hover',
                placement: 'auto',
                html: true,
                delay: {show: 50, hide: 100}
            });
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
                    <p className="help-block-samples">
                        <span className="text-muted">Sample datasets</span>
                        {component.props.samples.map(function(item) {
                            var dataContent = [
                                '<p><strong>Symbol:</strong> ' + item.symbol + '</p>',
                                '<p><strong>Cell line:</strong> ' + item.cellLine + '</p>',
                                '<p><strong>Species:</strong> ' + item.species + '</p>',
                                '<p><strong>Disease state:</strong> ' + item.diseaseState + '</p>'
                            ].join('');
                            return (
                                <a
                                    className="btn btn-link btn-xs btn-explore"
                                    id={item.id}
                                    title={item.symbol}
                                    data-content={dataContent}
                                    onClick={component.props.onSampleClick}
                                    >
                                    {item.symbol}
                                </a>
                            );
                        })}
                    </p>
                </div>
            </div>
        );
    }
});

var SelectCollections = React.createClass({
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
        var button;
        if (!this.props.disabled) {
            button = (
                <button
                    className="btn btn-primary btn-sm"
                    disabled={this.props.disabled}
                    onClick={this.props.onInputSubmitClick}
                    >
                    <i className="fa fa-send"></i> Submit
                </button>
            );
        } else {
            button = (
                <button
                    className="btn btn-danger btn-sm"
                    disabled={!this.props.disabled}
                    onClick={this.props.onInputCancelClick}
                    >
                    <i className="fa fa-times-circle"></i> Cancel
                </button>
            );
        }
        return (
            <div className="panel panel-info panel-analyze">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        <i className="fa fa-flask"></i>
                        &nbsp;
                        Analyze
                    </h3>
                </div>
                <div className="panel-body">
                    <div className="form-horizontal">
                        <InputBedFile
                            label="BED file"
                            samples={this.props.samples}
                            disabled={this.props.disabled}
                            inputBedFileName={this.props.inputBedFileName}
                            onSampleClick={this.props.onSampleClick}
                            onChange={this.props.onInputBedFileChange}
                        />
                        <SelectCollections
                            label="Collections"
                            options={this.props.collections}
                            help="Hold Ctrl to select multiple gene set collections"
                            disabled={this.props.disabled}
                            onChange={this.props.onSelectCollectionsChange}
                        />
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                {button}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );
        }
});

var ResultBarChart = React.createClass({
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

        var chart = d3.select(el).selectAll('.chart');

        var x = chart.selectAll('.x')
            .attr("transform", "translate(0," + size.height + ")")
            .call(xAxis)

        x.selectAll("text")
            .style("font", "10px sans-serif")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-0.5em")
            .attr("transform", "rotate(-75)");

        x.selectAll("path")
            .style("display", "none");

        x.selectAll("line")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges");

        var y = chart.selectAll('.y')
            .call(yAxis);

        y.selectAll("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges");

        y.selectAll("line")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges");

        var bar = chart.selectAll('.bars')
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
        var chart = d3.select(el)
          .append("svg")
            .attr("id", id)
            .attr("width", size.width + size.margin.left + size.margin.right)
            .attr("height", size.height + size.margin.top + size.margin.bottom)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("version", "1.1")
          .append("g")
            .attr("class", "chart")
            .attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");

        chart.append("g").attr("class", "bars");
        chart.append("g").attr("class", "x axis");
        chart.append("g").attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", -(size.height / 2))
            .attr("dy", "1em")
            .style("font", "10px sans-serif")
            .style("text-anchor", "middle")
            .text("-Log10(Comb. p-value)");

        this.updateChart(el, size, data);
    },
    componentDidMount: function() {
        var el = this.getDOMNode(),
            width = el.parentNode.previousSibling.offsetWidth,
            state = this.getChartState(width);
        this.createChart(el, state.size, state.data, state.id);
    },
    componentDidUpdate: function() {
        var el = this.getDOMNode(),
            width = el.parentNode.previousSibling.offsetWidth,
            state = this.getChartState(width);
        this.updateChart(el, state.size, state.data);
    },
    render: function() {
        return (
            <div className="bar-chart"></div>
        );
    }
});

var ResultModal = React.createClass({
    render: function() {
        return (
            <div class="modal fade" tabindex="-1" role="dialog">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Genes</h4>
                  </div>
                  <div class="modal-body">
                    <p>One fine body&hellip;</p>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});

var SortIcon = React.createClass({
    render: function() {
        var direction = (this.props.direction.length > 0) ? "-" + this.props.direction: "";
        return <i className={"fa fa-fw fa-sort" + direction}></i>;
    }
});

var ResultTable = React.createClass({
    render: function() {
            var component = this,
                result = component.props.result,
                directions = component.props.sortDirections;

            if (result.enrichment.length > 0) {
                return (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-panel">
                            <thead>
                                <tr>
                                    <th>
                                        Gene set
                                    </th>
                                    <th
                                        onClick={component.props.onSort}
                                        id={result.id + "-percent"}>
                                        %
                                        <SortIcon direction={directions.percent} />
                                    </th>
                                    <th
                                        onClick={component.props.onSort}
                                        id={result.id + "-fPValue"}>
                                        Func. p-value
                                        <SortIcon direction={directions.fPValue} />
                                    </th>
                                    <th
                                        onClick={component.props.onSort}
                                        id={result.id + "-fPValueCorr"}>
                                        Func. p-value corr.
                                        <SortIcon direction={directions.fPValueCorr} />
                                    </th>
                                    <th
                                        onClick={component.props.onSort}
                                        id={result.id + "-gSPValue"}>
                                        G. set p-value
                                        <SortIcon direction={directions.gSPValue} />
                                    </th>
                                    <th
                                        onClick={component.props.onSort}
                                        id={result.id + "-cPValue"}>
                                        Comb. p-value
                                        <SortIcon direction={directions.cPValue} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.enrichment.map(function(row) {
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

var Result = React.createClass({
    render: function() {
        var component = this,
            result = component.props.result,
            result = {
                id: result.id,
                title: result.title,
                enrichment: result.enrichment.filter(function(el) {
                    return el.percent > component.props.resultsOptions.percent &&
                           el.cPValue < component.props.resultsOptions.pValue;
                })
            },
            exportButtons,
            resultBarChart;

        if (result.enrichment.length > 0) {
            exportButtons = (
                <div className="col-xs-6 text-right">
                    Export
                    &nbsp;
                    <i
                        className="fa fa-bar-chart btn-export"
                        title="Export bar chart as SVG"
                        id={result.id}
                        onClick={component.props.onExportBarChart}
                        aria-hidden="true"
                        >
                    </i>
                    &nbsp;
                    <i
                        className="fa fa-table btn-export"
                        title="Export table as TSV"
                        id={result.id}
                        onClick={component.props.onExportTable}
                        aria-hidden="true"
                        >
                    </i>
                </div>
            );
            resultBarChart = (
                <ResultBarChart
                    id={result.id}
                    data={result.enrichment}
                    />
            );
        }
        return (
            <div className="panel panel-primary">
                <div className="panel-heading" role="tab" id={'heading-' + result.id}>
                    <div className="row">
                        <div className="col-xs-6">
                            <h4 className="panel-title">
                                <a
                                    className="collapsed"
                                    role="button"
                                    data-toggle="collapse"
                                    href={'#collapse-' + result.id}
                                    aria-expanded="true"
                                    aria-controls={'collapse-' + result.id}
                                    >
                                    {result.title}
                                </a>
                                &nbsp;
                                <span className="badge">{result.enrichment.length}</span>
                            </h4>
                        </div>
                        {exportButtons}
                    </div>
                </div>
                <div
                    id={'collapse-' + result.id}
                    className="panel-collapse collapse"
                    role="tabpanel"
                    aria-labelledby={'heading-' + result.id}
                    >
                    {resultBarChart}
                    <ResultTable
                        result={result}
                        sortDirections={component.props.sortDirections}
                        onSort={component.props.onSort}
                        />
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

var ResultGroupInfo = React.createClass({
    render: function(argument) {
        var l = Object.keys(this.props.info).length;
        if (l) {
            if (l > 1) {
                return (
                    <div>
                        <h3>
                            {this.props.info.symbol} ({this.props.info.cellLine})
                        </h3>
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
                                        <td>{this.props.info.symbol}</td>
                                        <td>{this.props.info.cellLine}</td>
                                        <td>{this.props.info.species}</td>
                                        <td>{this.props.info.diseaseState}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            } else {
                return (
                    <h3>
                        {this.props.info.filename}
                    </h3>
                );
            }
        } else {
            return (
                <div></div>
            );
        }
    }
});

var ResultGroupOptions = React.createClass({
    render: function() {
        if (this.props.show) {
            return (
                <div className="form-inline">
                    <div className="form-group">
                        <label className="text-muted">Options</label>
                    </div>
                    <div className="form-group">
                        <label>Percent &gt;</label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.props.resultsOptions.percent}
                            onChange={this.props.onOptionsPercentChange}
                            />
                    </div>
                    <div className="form-group">
                        <label>Comb. p-value &lt;</label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.props.resultsOptions.pValue}
                            onChange={this.props.onOptionsPValueChange}
                            />
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

var ResultGroup = React.createClass({
    render: function() {
        var component = this;
        return (
            <div>
                <ResultGroupProgressBar
                    show={component.props.isRunning}
                    progress={component.props.progress}
                    />
                <ResultGroupInfo
                    info={component.props.resultsInfo}
                    />
                <ResultGroupOptions
                    show={component.props.results.length}
                    resultsOptions={component.props.resultsOptions}
                    onOptionsPercentChange={component.props.onOptionsPercentChange}
                    onOptionsPValueChange={component.props.onOptionsPValueChange}
                    />
                <div className="panel-group" role="tablist" aria-multiselectable="true">
                    {component.props.results.map(function(result) {
                          return (
                                <Result
                                    result={result}
                                    sortDirections={component.props.sortDirections}
                                    resultsOptions={component.props.resultsOptions}
                                    onSort={component.props.onSort}
                                    onExportBarChart={component.props.onExportBarChart}
                                    onExportTable={component.props.onExportTable}
                                    />
                          );
                    })}
                </div>
            </div>
        );
    }
});

var SetenApp = React.createClass({
    getInitialState: function() {
        return {
                inputBedFile: undefined,
                inputBedFileName: '',
                inputCollections: undefined,
                workers: [],
                geneScores: [],
                geneCollections: [],
                results: [],
                resultsInfo: {},
                resultsOptions: {
                    percent: 5,
                    pValue: 0.01
                },
                isRunning: false,
                sortAscOrder: false,
                sortDirections: {
                    geneSet: '',
                    percent: '',
                    fPValue: '',
                    fPValueCorr: '',
                    gSPValue: '',
                    cPValue: 'asc'
                }
            };
    },
    clearState: function() {
        // clear some state variables
        this.setState({workers: []});
        this.setState({results: []});
        this.setState({resultsInfo: {}});
        this.setState({geneCollections: []});
    },
    togglePanelAnalyze: function(e) {
        this.setState({isRunning: !this.state.isRunning});
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
    handleInputSubmit: function(e) {
        e.preventDefault();
        var bedFile = this.state.inputBedFile,
            collections = this.state.inputCollections;

        if (bedFile !== undefined && collections !== undefined) {
            var mappingWorker = new Worker('assets/js/workers/mapping.js');

            // clear the state
            this.clearState();
            // toggle form
            this.togglePanelAnalyze();
            // start mapping worker to read and map the file
            mappingWorker.postMessage(bedFile);
            mappingWorker.onmessage = this.mappingWorkerOnMessage;
            // filename as results title
            this.setState({resultsInfo: {filename: this.state.inputBedFileName}});
            // add worker to the state
            this.setState({workers: this.state.workers.concat([mappingWorker])});
        } else {
            console.log('Missing input...');
        }
    },
    handleInputCancel: function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to cancel this analysis?')) {
            var workers = this.state.workers;

            // terminate all available workers
            workers.forEach(function(worker) {
                worker.terminate();
            });
            // clear the state
            this.clearState();
            // enable the panel back
            this.togglePanelAnalyze();
        }
    },
    handleSample: function(e) {
        e.preventDefault();
        var sample = e.currentTarget.id,
            sampleWorker = new Worker('assets/js/workers/sample.js');

        sampleWorker.postMessage(sample);
        sampleWorker.onmessage = this.sampleWorkerOnMessage;
    },
    handleExplore: function(e) {
        e.preventDefault();
        var component = this,
            result = e.currentTarget.id,
            exploreWorker = new Worker('assets/js/workers/explore.js');

        exploreWorker.postMessage({result:result, collections:collections});
        exploreWorker.onmessage = function(e) {
            component.exploreWorkerOnMessage(e, result);
        }
    },
    handleSort: function(e) {
        e.preventDefault();
        var id = e.currentTarget.id.split('-')[0],
            sort = e.currentTarget.id.split('-')[1],
            order = this.state.sortAscOrder,
            directions = this.state.sortDirections,
            results = this.state.results,
            _directions = {},
            _results = [],
            n = this.state.results.length,
            i = 0;

        while (i < n) {
            if (results[i]['id'] == id) {
                results[i].enrichment = results[i].enrichment.sort(function(a, b) {
                    return (order) ? a[sort] - b[sort]: b[sort] - a[sort];
                });
            }
            _results.push(results[i]);
            i++;
        }

        for (var d in directions) {
            if (d == sort) {
                if (order) {
                    _directions[d] = 'asc';
                } else {
                    _directions[d] = 'desc';
                }
            } else {
                _directions[d] = '';
            }
        }

        this.setState({results: _results});
        this.setState({sortAscOrder: !order});
        this.setState({sortDirections: _directions});
    },
    handleOptionsPercentChange: function(e) {
        var percent = e.target.value,
            resultsOptions = this.state.resultsOptions;

        resultsOptions.percent = percent;
        this.setState({resultsOptions: resultsOptions});
    },
    handleOptionsPValueChange: function(e) {
        var pValue = e.target.value;
        resultsOptions = this.state.resultsOptions;

        resultsOptions.pValue = pValue;
        this.setState({resultsOptions: resultsOptions});
    },
    handleExportBarChart: function(e) {
        e.preventDefault();
        var id = e.currentTarget.id,
            query = 'svg#' + id,
            svg = document.querySelector(query),
            a = document.createElement('a');

        if (svg.outerHTML.length > 0) {
            var data = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
            a.href = window.URL.createObjectURL(data);
            a.setAttribute('download', id + '.svg');
            a.dispatchEvent(clickEvent);
            a.remove();
        }
    },
    handleExportTable: function(e) {
        e.preventDefault();
        var id = e.currentTarget.id,
            results = this.state.results,
            result;
        result = results.filter(function(result) {
            return result.id == id;
        });
        if (result.length == 1) {
            var tsv = [
                'Gene set',
                'Overlap size',
                'Gene set size',
                '%',
                'Func. p-value',
                'Func. p-value corr.',
                'G. set p-value',
                'Comb. p-value'
            ].join('\t') + '\n';
            result[0].enrichment.forEach(function(row) {
                tsv += [
                    row.geneSet,
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
            a.setAttribute('download', result[0].id + '.tsv');
            a.dispatchEvent(clickEvent);
            a.remove();
        }
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
        var results = this.state.results.concat([e.data]);
        // add results to the state
        this.setState({results: results});
        // check if job is complete
        if (this.state.results.length == this.state.inputCollections.length) {
            // enable the panel back
            this.togglePanelAnalyze();
        }
    },
    sampleWorkerOnMessage: function(e) {
        this.setState({inputBedFile: e.data.file});
        this.setState({inputBedFileName: e.data.name});
    },
    exploreWorkerOnMessage: function(e, result) {
        var resultsParent = this.props.explore[result.split('-')[0]],
            resultsInfo = resultsParent.filter(function(el) {
            return el.id == result;
        });
        this.setState({resultsInfo: resultsInfo[0]});
        this.setState({results: e.data});
    },
    render: function() {
        var progress;
        if (this.state.inputCollections !== undefined) {
            progress = Math.round(
                (this.state.results.length/this.state.inputCollections.length)*100);
        }
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        <PanelExplore
                            explore={this.props.explore}
                            onExplore={this.handleExplore}
                            />
                    </div>
                    <div className="col-sm-8">
                        <PanelAnalyze
                            collections={this.props.collections}
                            samples={this.props.samples}
                            disabled={this.state.isRunning}
                            inputBedFileName={this.state.inputBedFileName}
                            onInputBedFileChange={this.handleInputBedFileChange}
                            onSampleClick={this.handleSample}
                            onSelectCollectionsChange={this.handleSelectCollectionsChange}
                            onInputSubmitClick={this.handleInputSubmit}
                            onInputCancelClick={this.handleInputCancel}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <ResultGroup
                            results={this.state.results}
                            resultsInfo={this.state.resultsInfo}
                            resultsOptions={this.state.resultsOptions}
                            progress={progress}
                            isRunning={this.state.isRunning}
                            sortDirections={this.state.sortDirections}
                            onSort={this.handleSort}
                            onOptionsPercentChange={this.handleOptionsPercentChange}
                            onOptionsPValueChange={this.handleOptionsPValueChange}
                            onExportBarChart={this.handleExportBarChart}
                            onExportTable={this.handleExportTable}
                            />
                    </div>
                </div>
            </div>
        );
    }
});

var collections = [
    {id: 'reactome', filename: 'c2.cp.reactome.v5.0.symbols', name: 'Pathways: REACTOME'},
    {id: 'biocarta', filename: 'c2.cp.biocarta.v5.0.symbols', name: 'Pathways: BIOCARTA'},
    {id: 'kegg', filename: 'c2.cp.kegg.v5.0.symbols', name: 'Pathways: KEGG'},
    {id: 'bp', filename: 'c5.bp.v5.0.symbols', name: 'GO: Biological Process'},
    {id: 'mf', filename: 'c5.mf.v5.0.symbols', name: 'GO: Molecular Function'},
    {id: 'cc', filename: 'c5.cc.v5.0.symbols', name: 'GO: Cellular Component'},
    {id: 'hpo', filename: 'cx.hpo.v5.0.symbols', name: 'Human Phenotype Ontology'},
    {id: 'malacards', filename: 'cx.malacards.v5.0.symbols', name: 'MalaCards Disease Ontology'}
];

var samples = [
    {id: "FIP1L1_HEK293", symbol: "FIP1L1", name: "FIP1L1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"},
    {id: "PRPF8_K562_ENCSR534YOI", symbol: "PRPF8", diseaseState: "Hepatocellular carcinoma", cellLine: "K562", species: "Human"},
];

var explore = {
    clipdb: [
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
        {id: "clipdb-ZC3H7B_HEK293", symbol: "ZC3H7B", name: "ZC3H7B", diseaseState: "Cancer", cellLine: "HEK293", species: "Human"}
    ],
    encode: [
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
        {id: 'encode-IGF2BP1_K562_ENCSR427DED', symbol: 'IGF2BP1', name: 'IGF2BP1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
        {id: 'encode-IGF2BP1_K562_ENCSR975KIR', symbol: 'IGF2BP1', name: 'IGF2BP1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
        {id: 'encode-IGF2BP2_K562_ENCSR062NNB', symbol: 'IGF2BP2', name: 'IGF2BP2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
        {id: 'encode-IGF2BP2_K562_ENCSR193PVE', symbol: 'IGF2BP2', name: 'IGF2BP2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human"},
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
    ]
};

ReactDOM.render(
    <SetenApp
        collections={collections}
        samples={samples}
        explore={explore}
        />,
    document.querySelector('.container-app')
);
