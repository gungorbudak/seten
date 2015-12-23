'use strict';

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
                        <p className="list-group-item-text">Precomputed gene set enrichment analysis results for RBPs from CLIPdb project.</p>
                    </div>
                    {clipdb.map(function(item) {
                        return (
                            <a href="#" className="list-group-item" id={item.id} onClick={component.props.onExplore}>{item.symbol}</a>
                        );
                    })}
                    <div className="list-group-item">
                        <h4 className="list-group-item-heading">ENCODE</h4>
                        <p className="list-group-item-text">Precomputed gene set enrichment analysis results for RBPs from ENCODE project.</p>
                    </div>
                    {encode.map(function(item) {
                        return (
                            <a href="#" className="list-group-item" id={item.id} onClick={component.props.onExplore}>{item.symbol} ({item.cellLine})</a>
                        );
                    })}
                </div>
            </div>
        );
    }
});

var InputBedFile = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label">{this.props.label}</label>
                <div className="col-sm-10">
                    <div className="input-group input-group-sm">
                        <span className="input-group-btn">
                            <span
                                className="btn btn-default btn-file"
                                disabled={this.props.disabled}>
                                Browse&hellip;
                                <input
                                    type="file"
                                    name="file"
                                    onChange={this.props.onChange}
                                />
                            </span>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            disabled={this.props.disabled}
                            value={this.props.inputBedFileName}
                            readOnly={true}
                            />
                    </div>
                    <p className="help-block">
                        Sample datasets
                        <a
                            className="btn btn-link btn-xs"
                            id="fip1l1"
                            onClick={this.props.onSampleClick}
                            >
                            FIP1l1
                        </a>
                        <a
                            className="btn btn-link btn-xs"
                            id="prpf8"
                            onClick={this.props.onSampleClick}
                            >
                            PRPF8
                        </a>
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
                <input
                    type="submit"
                    className="btn btn-primary btn-sm btn-submit"
                    value="Submit"
                    disabled={this.props.disabled}
                    onClick={this.props.onInputSubmitClick}
                />
            );
        } else {
            button = (
                <input
                    type="submit"
                    className="btn btn-danger btn-sm btn-submit"
                    value="Cancel"
                    disabled={!this.props.disabled}
                    onClick={this.props.onInputCancelClick}
                />
            );
        }
        return (
            <div className="panel panel-info panel-analyze">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        <i className="fa fa-bar-chart"></i>
                        &nbsp;
                        Analyze
                    </h3>
                </div>
                <div className="panel-body">
                    <div className="form-horizontal">
                        <InputBedFile
                            label="BED file"
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
    getChartState: function() {
        var panelWidth = 1138;
        var size = {
            margin: {top: 20, right: 10, bottom: 225, left: 50}
        };
        size.width = panelWidth - size.margin.right - size.margin.left;
        size.height = 450 - size.margin.top - size.margin.bottom;
        return {
            size: size,
            data: this.props.enrichment.map(function(el) {
                // -Log10 tranformation of p-values
                // for better visualization
                return {
                    n: (el.geneSet.length > 32) ? el.geneSet.substr(0, 29) + '...': el.geneSet,
                    val: -Math.log10(el.cPValue)
                };
            })
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
            .orient("left");

        var chart = d3.select(el).selectAll('.chart');

        var x = chart.selectAll('.x')
            .attr("transform", "translate(0," + size.height + ")")
            .call(xAxis)

        x.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-0.5em")
            .attr("transform", "rotate(-75)");

        chart.selectAll('.y')
            .call(yAxis);

        var bar = chart.selectAll('.bars')
            .selectAll(".bar")
            .data(data);

        bar.enter().append("rect")
            .attr("class", "bar")

        bar.attr("x", function(d) { return xScale(d.n); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.val); })
            .attr("height", function(d) { return size.height - yScale(d.val); });

        bar.exit().remove();
    },
    updateChart: function(el, size, data) {
        this.renderChart(el, size, data);
    },
    createChart: function(el, size, data) {
        var chart = d3.select(el)
            .append("svg")
            .attr("width", size.width + size.margin.left + size.margin.right)
            .attr("height", size.height + size.margin.top + size.margin.bottom)
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
            .style("text-anchor", "middle")
            .text("-Log10(Comb. p-value)");

        this.updateChart(el, size, data);
    },
    componentDidMount: function() {
        var el = this.getDOMNode();
        var state = this.getChartState();
        this.createChart(el, state.size, state.data);
    },
    componentDidUpdate: function() {
        var el = this.getDOMNode();
        var state = this.getChartState();
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
            return (
                <div className="table-responsive">
                    <table className="table table-striped">
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
                                            <abbr title={"Click to view " + row.overlapSize + "/" + row.geneSetSize + " genes"}
                                                onClick={component.props.onViewGenes}
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
        }
    });

var Result = React.createClass({
    render: function() {
        var result = this.props.result,
            sigEnrichment = result.enrichment.filter(function(el) {
                return el.cPValue < 0.01;
            }),
            resultBarChart;

        if (sigEnrichment.length > 0) {
            resultBarChart = (
                <ResultBarChart
                    enrichment={sigEnrichment}
                    />
            );
        }
        return (
            <div className="panel panel-primary">
                <div className="panel-heading" role="tab" id={'heading-' + result.id}>
                    <div className="row">
                        <div className="col-xs-6">
                            <h4 className="panel-title">
                                <a className="collapsed" role="button" data-toggle="collapse" href={'#collapse-' + result.id} aria-expanded="true" aria-controls={'collapse-' + result.id}>
                                    {result.title} ({result.enrichment.length})
                                </a>
                            </h4>
                        </div>
                        <div className="col-xs-6">
                            <span className="glyphicon glyphicon-download-alt btn-download pull-right" title="Export as TSV" id={result.id} onClick={this.props.onDownload} aria-hidden="true"></span>
                        </div>
                    </div>
                </div>
                <div id={'collapse-' + result.id} className="panel-collapse collapse" role="tabpanel" aria-labelledby={'heading-' + result.id}>
                    {resultBarChart}
                    <ResultTable
                        result={result}
                        sortDirections={this.props.sortDirections}
                        onSort={this.props.onSort}
                        onViewGenes={this.props.onViewGenes}
                        />
                </div>
            </div>
        );
    }
});

var ResultProgress = React.createClass({
    render: function() {
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
    }
});

var ResultGroup = React.createClass({
    render: function() {
        var component = this;
        var progressBar;
        if (component.props.isRunning) {
            progressBar = (
                <ResultProgress progress={component.props.progress} />
            );
        }
        return (
            <div>
                {progressBar}
                <div className="panel-group" role="tablist" aria-multiselectable="true">
                    {component.props.results.map(function(result) {
                          return (
                                <Result
                                    result={result}
                                    sortDirections={component.props.sortDirections}
                                    onSort={component.props.onSort}
                                    onViewGenes={component.props.onViewGenes}
                                    onDownload={component.props.onDownload}
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

            // empty results and gene collections
            this.setState({workers: []});
            this.setState({results: []});
            this.setState({geneCollections: []});
            // toggle form
            this.togglePanelAnalyze();
            // start mapping worker to read and map the file
            mappingWorker.postMessage(bedFile);
            mappingWorker.onmessage = this.mappingWorkerOnMessage;
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
            // clear some state variables
            this.setState({workers: []});
            this.setState({results: []});
            this.setState({geneCollections: []});
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
        var result = e.currentTarget.id,
            exploreWorker = new Worker('assets/js/workers/explore.js');

        exploreWorker.postMessage({result:result, collections:collections});
        exploreWorker.onmessage = this.exploreWorkerOnMessage;
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
    handleViewGenes: function(e) {
        console.log('Viewing genes');
    },
    handleDownload: function(e) {
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
            a.click();
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
    exploreWorkerOnMessage: function(e) {
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
                            progress={progress}
                            isRunning={this.state.isRunning}
                            sortDirections={this.state.sortDirections}
                            onSort={this.handleSort}
                            onViewGenes={this.handleViewGenes}
                            onDownload={this.handleDownload}
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

var explore = {
    clipdb: [
        {id: 'clipdb-ago1', symbol: 'AGO1', name: 'AGO1', cellLine: null},
        {id: 'clipdb-ago2', symbol: 'AGO2', name: 'AGO2', cellLine: null},
        {id: 'clipdb-ago3', symbol: 'AGO3', name: 'AGO3', cellLine: null},
        {id: 'clipdb-ago4', symbol: 'AGO4', name: 'AGO4', cellLine: null},
        {id: 'clipdb-alkbh5', symbol: 'ALKBH5', name: 'ALKBH5', cellLine: null},
        {id: 'clipdb-c17orf85', symbol: 'C17ORF85', name: 'C17ORF85', cellLine: null},
        {id: 'clipdb-caprin1', symbol: 'CAPRIN1', name: 'CAPRIN1', cellLine: null},
        {id: 'clipdb-cpsf1', symbol: 'CPSF1', name: 'CPSF1', cellLine: null},
        {id: 'clipdb-cpsf2', symbol: 'CPSF2', name: 'CPSF2', cellLine: null},
        {id: 'clipdb-cpsf3', symbol: 'CPSF3', name: 'CPSF3', cellLine: null},
        {id: 'clipdb-cpsf4', symbol: 'CPSF4', name: 'CPSF4', cellLine: null},
        {id: 'clipdb-cpsf6', symbol: 'CPSF6', name: 'CPSF6', cellLine: null},
        {id: 'clipdb-cpsf7', symbol: 'CPSF7', name: 'CPSF7', cellLine: null},
        {id: 'clipdb-cstf2', symbol: 'CSTF2', name: 'CSTF2', cellLine: null},
        {id: 'clipdb-cstf2t', symbol: 'CSTF2T', name: 'CSTF2T', cellLine: null},
        {id: 'clipdb-dgcr8', symbol: 'DGCR8', name: 'DGCR8', cellLine: null},
        {id: 'clipdb-eif4a3', symbol: 'EIF4A3', name: 'EIF4A3', cellLine: null},
        {id: 'clipdb-elavl1', symbol: 'ELAVL1', name: 'ELAVL1', cellLine: null},
        {id: 'clipdb-ezh2', symbol: 'EZH2', name: 'EZH2', cellLine: null},
        {id: 'clipdb-fbl', symbol: 'FBL', name: 'FBL', cellLine: null},
        {id: 'clipdb-fip1l1', symbol: 'FIP1L1', name: 'FIP1L1', cellLine: null},
        {id: 'clipdb-fmr1', symbol: 'FMR1', name: 'FMR1', cellLine: null},
        {id: 'clipdb-fus', symbol: 'FUS', name: 'FUS', cellLine: null},
        {id: 'clipdb-fxr1', symbol: 'FXR1', name: 'FXR1', cellLine: null},
        {id: 'clipdb-fxr2', symbol: 'FXR2', name: 'FXR2', cellLine: null},
        {id: 'clipdb-hnrnpa1', symbol: 'HNRNPA1', name: 'HNRNPA1', cellLine: null},
        {id: 'clipdb-hnrnpa2b1', symbol: 'HNRNPA2B1', name: 'HNRNPA2B1', cellLine: null},
        {id: 'clipdb-hnrnpc', symbol: 'HNRNPC', name: 'HNRNPC', cellLine: null},
        {id: 'clipdb-hnrnpf', symbol: 'HNRNPF', name: 'HNRNPF', cellLine: null},
        {id: 'clipdb-hnrnpm', symbol: 'HNRNPM', name: 'HNRNPM', cellLine: null},
        {id: 'clipdb-hnrnpu', symbol: 'HNRNPU', name: 'HNRNPU', cellLine: null},
        {id: 'clipdb-igf2bp1', symbol: 'IGF2BP1', name: 'IGF2BP1', cellLine: null},
        {id: 'clipdb-igf2bp2', symbol: 'IGF2BP2', name: 'IGF2BP2', cellLine: null},
        {id: 'clipdb-igf2bp3', symbol: 'IGF2BP3', name: 'IGF2BP3', cellLine: null},
        {id: 'clipdb-lin28a', symbol: 'LIN28A', name: 'LIN28A', cellLine: null},
        {id: 'clipdb-lin28b', symbol: 'LIN28B', name: 'LIN28B', cellLine: null},
        {id: 'clipdb-mov10', symbol: 'MOV10', name: 'MOV10', cellLine: null},
        {id: 'clipdb-nop56', symbol: 'NOP56', name: 'NOP56', cellLine: null},
        {id: 'clipdb-nop58', symbol: 'NOP58', name: 'NOP58', cellLine: null},
        {id: 'clipdb-nudt21', symbol: 'NUDT21', name: 'NUDT21', cellLine: null},
        {id: 'clipdb-ptbp1_ptbp2', symbol: 'PTBP1_PTBP2', name: 'PTBP1_PTBP2', cellLine: null},
        {id: 'clipdb-pum2', symbol: 'PUM2', name: 'PUM2', cellLine: null},
        {id: 'clipdb-qki', symbol: 'QKI', name: 'QKI', cellLine: null},
        {id: 'clipdb-rtcb', symbol: 'RTCB', name: 'RTCB', cellLine: null},
        {id: 'clipdb-taf15', symbol: 'TAF15', name: 'TAF15', cellLine: null},
        {id: 'clipdb-tardbp', symbol: 'TARDBP', name: 'TARDBP', cellLine: null},
        {id: 'clipdb-tia1', symbol: 'TIA1', name: 'TIA1', cellLine: null},
        {id: 'clipdb-tial1', symbol: 'TIAL1', name: 'TIAL1', cellLine: null},
        {id: 'clipdb-tnrc6a', symbol: 'TNRC6A', name: 'TNRC6A', cellLine: null},
        {id: 'clipdb-tnrc6b', symbol: 'TNRC6B', name: 'TNRC6B', cellLine: null},
        {id: 'clipdb-tnrc6c', symbol: 'TNRC6C', name: 'TNRC6C', cellLine: null},
        {id: 'clipdb-ythdf2', symbol: 'YTHDF2', name: 'YTHDF2', cellLine: null},
        {id: 'clipdb-zc3h7b', symbol: 'ZC3H7B', name: 'ZC3H7B', cellLine: null}
    ],
    encode: [
        {id: 'encode-AUH_HepG2_ENCSR334QFR', symbol: 'AUH', name: 'AUH', cellLine: 'HepG2'},
        {id: 'encode-AUH_K562_ENCSR541QHS', symbol: 'AUH', name: 'AUH', cellLine: 'K562'},
        {id: 'encode-BCCIP_HepG2_ENCSR485QCG', symbol: 'BCCIP', name: 'BCCIP', cellLine: 'HepG2'},
        {id: 'encode-CPSF6_K562_ENCSR532VUB', symbol: 'CPSF6', name: 'CPSF6', cellLine: 'K562'},
        {id: 'encode-DDX42_K562_ENCSR576SHT', symbol: 'DDX42', name: 'DDX42', cellLine: 'K562'},
        {id: 'encode-EIF4G1_K562_ENCSR961WWI', symbol: 'EIF4G1', name: 'EIF4G1', cellLine: 'K562'},
        {id: 'encode-EIF4G2_K562_ENCSR307YIW', symbol: 'EIF4G2', name: 'EIF4G2', cellLine: 'K562'},
        {id: 'encode-FKBP4_HepG2_ENCSR018ZUE', symbol: 'FKBP4', name: 'FKBP4', cellLine: 'HepG2'},
        {id: 'encode-FMR1_K562_ENCSR331VNX', symbol: 'FMR1', name: 'FMR1', cellLine: 'K562'},
        {id: 'encode-FUS_K562_ENCSR477TRN', symbol: 'FUS', name: 'FUS', cellLine: 'K562'},
        {id: 'encode-HNRNPA1_HepG2_ENCSR769UEW', symbol: 'HNRNPA1', name: 'HNRNPA1', cellLine: 'HepG2'},
        {id: 'encode-HNRNPA1_K562_ENCSR154HRN', symbol: 'HNRNPA1', name: 'HNRNPA1', cellLine: 'K562'},
        {id: 'encode-HNRNPM_HepG2_ENCSR267UCX', symbol: 'HNRNPM', name: 'HNRNPM', cellLine: 'HepG2'},
        {id: 'encode-HNRNPM_K562_ENCSR412NOW', symbol: 'HNRNPM', name: 'HNRNPM', cellLine: 'K562'},
        {id: 'encode-HNRNPU_HepG2_ENCSR240MVJ', symbol: 'HNRNPU', name: 'HNRNPU', cellLine: 'HepG2'},
        {id: 'encode-HNRNPU_K562_ENCSR520BZQ', symbol: 'HNRNPU', name: 'HNRNPU', cellLine: 'K562'},
        {id: 'encode-IGF2BP1_HepG2_ENCSR744GEU', symbol: 'IGF2BP1', name: 'IGF2BP1', cellLine: 'HepG2'},
        {id: 'encode-IGF2BP1_K562_ENCSR427DED', symbol: 'IGF2BP1', name: 'IGF2BP1', cellLine: 'K562'},
        {id: 'encode-IGF2BP1_K562_ENCSR975KIR', symbol: 'IGF2BP1', name: 'IGF2BP1', cellLine: 'K562'},
        {id: 'encode-IGF2BP2_K562_ENCSR062NNB', symbol: 'IGF2BP2', name: 'IGF2BP2', cellLine: 'K562'},
        {id: 'encode-IGF2BP2_K562_ENCSR193PVE', symbol: 'IGF2BP2', name: 'IGF2BP2', cellLine: 'K562'},
        {id: 'encode-IGF2BP3_HepG2_ENCSR993OLA', symbol: 'IGF2BP3', name: 'IGF2BP3', cellLine: 'HepG2'},
        {id: 'encode-IGF2BP3_K562_ENCSR096IJV', symbol: 'IGF2BP3', name: 'IGF2BP3', cellLine: 'K562'},
        {id: 'encode-LARP7_K562_ENCSR456KXI', symbol: 'LARP7', name: 'LARP7', cellLine: 'K562'},
        {id: 'encode-PRPF8_K562_ENCSR534YOI', symbol: 'PRPF8', name: 'PRPF8', cellLine: 'K562'},
        {id: 'encode-RBFOX2_HepG2_ENCSR987FTF', symbol: 'RBFOX2', name: 'RBFOX2', cellLine: 'HepG2'},
        {id: 'encode-SAFB2_K562_ENCSR943MHU', symbol: 'SAFB2', name: 'SAFB2', cellLine: 'K562'},
        {id: 'encode-SLBP_K562_ENCSR483NOP', symbol: 'SLBP', name: 'SLBP', cellLine: 'K562'},
        {id: 'encode-SLTM_K562_ENCSR000SSH', symbol: 'SLTM', name: 'SLTM', cellLine: 'K562'},
        {id: 'encode-SRSF9_HepG2_ENCSR773KRC', symbol: 'SRSF9', name: 'SRSF9', cellLine: 'HepG2'},
        {id: 'encode-TIA1_HepG2_ENCSR623VEQ', symbol: 'TIA1', name: 'TIA1', cellLine: 'HepG2'},
        {id: 'encode-TIAL1_K562_ENCSR441YTO', symbol: 'TIAL1', name: 'TIAL1', cellLine: 'K562'},
        {id: 'encode-TRA2A_HepG2_ENCSR314UMJ', symbol: 'TRA2A', name: 'TRA2A', cellLine: 'HepG2'},
        {id: 'encode-TRA2A_K562_ENCSR365NVO', symbol: 'TRA2A', name: 'TRA2A', cellLine: 'K562'},
        {id: 'encode-U2AF1_K562_ENCSR862QCH', symbol: 'U2AF1', name: 'U2AF1', cellLine: 'K562'},
        {id: 'encode-U2AF2_K562_ENCSR893RAV', symbol: 'U2AF2', name: 'U2AF2', cellLine: 'K562'},
        {id: 'encode-XRN2_K562_ENCSR657TZB', symbol: 'XRN2', name: 'XRN2', cellLine: 'K562'}
    ]
};

ReactDOM.render(<SetenApp collections={collections} explore={explore} />, document.querySelector('.container-app'));
