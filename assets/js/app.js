'use strict';

var InputBedFile = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label">{this.props.label}</label>
                <div className="col-sm-10">
                    <input
                        type="file"
                        name="file"
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}
                    />
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
                                <option value={option.value} id={option.name}>{option.label}</option>
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
        return (
            <div className="panel panel-info panel-analyze">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        <i className="fa fa-bar-chart"></i>
                        &nbsp;Analyze
                    </h3>
                </div>
                <div className="panel-body">
                    <div className="form-horizontal">
                        <InputBedFile
                            label="BED file"
                            disabled={this.props.disabled}
                            onChange={this.props.onInputBedFileChange}
                        />
                        <SelectCollections
                            label="Collections"
                            options={this.props.collections}
                            help="Hold Ctrl to select multiple collections."
                            disabled={this.props.disabled}
                            onChange={this.props.onSelectCollectionsChange}
                        />
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <input
                                    type="submit"
                                    className="btn btn-primary btn-sm btn-submit"
                                    value="Submit"
                                    disabled={this.props.disabled}
                                    onClick={this.props.onInputSubmitClick}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                        &nbsp;Explore
                    </h3>
                </div>

                <div className="list-group list-group-explore">
                    <div className="list-group-item">
                        <h4 className="list-group-item-heading">CLIPdb</h4>
                        <p className="list-group-item-text">Precomputed gene set enrichment analysis results for RBPs from CLIPdb project.</p>
                    </div>
                    {clipdb.map(function(item) {
                        return (
                            <a href="#" className="list-group-item" id={item.id} onClick={component.props.onExplore}>{item.symbol} ({item.name})</a>
                        );
                    })}
                    <div className="list-group-item">
                        <h4 className="list-group-item-heading">ENCODE</h4>
                        <p className="list-group-item-text">Precomputed gene set enrichment analysis results for RBPs from ENCODE project.</p>
                    </div>
                    {encode.map(function(item) {
                        return (
                            <a href="#" className="list-group-item" id={item.id} onClick={component.props.onExplore}>{item.symbol} ({item.name})</a>
                        );
                    })}
                </div>
            </div>
        );
    }
});

var ResultBarChart = React.createClass({
    createChart: function(el, size, state) {
        var x = d3.scale.ordinal()
            .rangeBands([0, size.width], 0.1)
            .domain(state.data.map(function(d) { return d.n; }));

        var y = d3.scale.linear()
            .range([size.height, 0])
            .domain([0, d3.max(state.data, function(d) { return d.val; })]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var chart = d3.select(el)
            .append("svg")
            .attr("width", size.width + size.margin.left + size.margin.right)
            .attr("height", size.height + size.margin.top + size.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");

        chart.append("g").attr("class", "bars")
          .selectAll(".bar")
          .data(state.data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.n); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.val); })
          .attr("height", function(d) { return size.height - y(d.val); });

        chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + size.height + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-1em")
          .attr("dy", "0em")
          .attr("transform", "rotate(-60)");

        chart.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -40)
          .attr("x", -(size.height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("-Log10(Comb. p-value)");

    },
    componentDidMount: function() {
        var el = this.getDOMNode();
        var panelWidth = 1138;
        var size = {
            margin: {top: 20, right: 10, bottom: 200, left: 50}
        };
        size.width = panelWidth - size.margin.right - size.margin.left;
        size.height = 450 - size.margin.top - size.margin.bottom;
        var state = {
            data: this.props.enrichment.map(function(el) {
                // -Log10 tranformation of p-values
                // for better visualization
                return {
                    n: el.geneSet,
                    val: -Math.log10(el.cPValue)
                };
            })
        };
        this.createChart(el, size, state);
    },
    render: function() {
        return (
            <div className="bar-chart"></div>
        );
    }
});

var ResultTable = React.createClass({
    render: function() {
            var component = this,
                result = component.props.result;
            return (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th onClick={component.props.onSort} id={result.id + "-geneSet"}>Gene set</th>
                                <th onClick={component.props.onSort} id={result.id + "-percent"}>%</th>
                                <th onClick={component.props.onSort} id={result.id + "-fPValue"}>Func. p-value</th>
                                <th onClick={component.props.onSort} id={result.id + "-fPValueCorr"}>Func. p-value corr.</th>
                                <th onClick={component.props.onSort} id={result.id + "-gSPValue"}>G. set p-value</th>
                                <th onClick={component.props.onSort} id={result.id + "-cPValue"}>Comb. p-value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.enrichment.map(function(row) {
                                var geneSet = row.geneSet;
                                if (geneSet.length > 60) {
                                    geneSet = <abbr title={geneSet}>{geneSet.substr(0, 60)}</abbr>;
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
                        onSort={this.props.onSort}
                        onViewGenes={this.props.onViewGenes}
                        />
                </div>
            </div>
        );
    }
});

var ResultGroup = React.createClass({
    render: function() {
        var component = this;
        return (
            <div className="panel-group" role="tablist" aria-multiselectable="true">
                {component.props.results.map(function(result) {
                      return (
                            <Result
                                result={result}
                                onSort={component.props.onSort}
                                onViewGenes={component.props.onViewGenes}
                                onDownload={component.props.onDownload}
                                />
                      );
                })}
            </div>
        );
    }
});

var SetenApp = React.createClass({
    getInitialState: function() {
        return {
                bedFile: undefined,
                collections: undefined,
                geneScores: [],
                results: [],
                isActive: true,
                isRunning: false,
                sortAscOrder: true
            };
    },
    togglePanelAnalyze: function(e) {
        this.setState({isRunning: !this.state.isRunning});
    },
    handleInputBedFileChange: function(e) {
        this.setState({bedFile: e.target.files[0]});
    },
    handleSelectCollectionsChange: function(e) {
        var options = e.target.options,
            n = e.target.options.length,
            i = 0,
            collections = [];
        while (i < n) {
            if (options[i].selected) {
                collections.push({
                    value: options[i].value,
                    name: options[i].id,
                    text: options[i].text
                });
            }
            i++;
        }
        if (!collections.length) {
            collections = undefined;
        }
        this.setState({collections: collections});
    },
    handleInputSubmit: function(e) {
        e.preventDefault();
        var bedFile = this.state.bedFile;
        var collections = this.state.collections;
        if (bedFile !== undefined && collections !== undefined) {
            // empty results
            this.state.results = [];
            // toggle form
            this.togglePanelAnalyze();
            // start worker for reading given file
            var fileWorker = new Worker('assets/js/fileWorker.js');
            fileWorker.postMessage(bedFile);
            fileWorker.onmessage = this.fileWorkerOnMessage;
        } else {
            console.log('Missing input');
        }
    },
    handleExplore: function(e) {
        e.preventDefault();
        var result = e.currentTarget.id;
        var exploreWorker = new Worker('assets/js/exploreWorker.js');
        exploreWorker.postMessage({result:result, collections:collections});
        exploreWorker.onmessage = this.exploreWorkerOnMessage;
    },
    handleSort: function(e) {
        e.preventDefault();
        var id = e.currentTarget.id.split('-')[0],
            sort = e.currentTarget.id.split('-')[1],
            order = this.state.sortAscOrder,
            results = this.state.results,
            sorted_results = [],
            n = this.state.results.length,
            i = 0;

        while (i < n) {
            if (results[i]['id'] == id) {
                results[i].enrichment = results[i].enrichment.sort(function(a, b) {
                    return (order) ? a[sort] - b[sort]: b[sort] - a[sort];
                });
            }
            sorted_results.push(results[i]);
            i++;
        }

        this.setState({results: sorted_results});
        this.setState({sortAscOrder: !order});
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
            var tsv = ['Gene set',
                'Overlap size',
                'Gene set size',
                '%',
                'Func. p-value',
                'Func. p-value corr.',
                'G. set p-value',
                'Comb. p-value'].join('\t') + '\n';
            result[0].enrichment.forEach(function(row) {
                tsv += [row.geneSet,
                        row.overlapSize,
                        row.geneSetSize,
                        row.percent,
                        row.fPValue,
                        row.fPValueCorr,
                        row.gSPValue,
                        row.cPValue].join('\t') + '\n';
            });
            var data = new Blob([tsv], {type: 'text/tsv'});
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(data);
            a.setAttribute('download', result[0].id + '.tsv');
            a.click();
            a.remove();
        }
    },
    parallelMapping: function(workerFile, chunks, callback) {
        var n = chunks.length,
            c = 0,
            r = [],
            mapWorker;

        function mapWorkerOnMessage(e) {
            r.push(e.data);
            c++;
            if (c == n) {
                callback(r);
            }
        };

        chunks.forEach(function(chunk) {
            mapWorker = new Worker(workerFile);
            mapWorker.postMessage(chunk);
            mapWorker.onmessage = mapWorkerOnMessage;
        });
    },
    fileWorkerOnMessage: function(e) {
        var chunks = e.data,
            component = this;
        this.parallelMapping('assets/js/mapWorker.js', chunks, function(r) {
            var preprocessWorker = new Worker('assets/js/preprocessWorker.js');
            preprocessWorker.postMessage(r);
            preprocessWorker.onmessage = component.preprocessWorkerOnMessage;
        });
    },
    preprocessWorkerOnMessage: function(e) {
        var component = this,
            geneScores = e.data,
            cols = this.state.collections,
            collectionWorker;

        component.setState({geneScores: geneScores});

        cols.forEach(function(col) {
            collectionWorker = new Worker('assets/js/collectionWorker.js');
            collectionWorker.postMessage(col.name);
            collectionWorker.onmessage = function(e) {
                component.collectionWorkerOnMessage(e, col);
            };
        });
    },
    collectionWorkerOnMessage: function(e, col) {
        var component = this,
            geneScores = this.state.geneScores,
            collection = e.data,
            enrichmentWorker = new Worker('assets/js/enrichmentWorker.js');

        enrichmentWorker.postMessage({
            'geneScores': geneScores,
            'collection': collection
        });
        enrichmentWorker.onmessage = function(e) {
            component.enrichmentWorkerOnMessage(e, col);
        };
    },
    enrichmentWorkerOnMessage: function(e, col) {
        var results = this.state.results.concat([{
                            id: col.value,
                            title: col.text,
                            enrichment: e.data
                        }]);
        this.setState({results: results});
        // check if job is complete
        if (this.state.results.length == this.state.collections.length) {
            this.togglePanelAnalyze();
        }
    },
    exploreWorkerOnMessage: function(e) {
        this.setState({results: e.data});
    },
    render: function() {
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
                            onInputBedFileChange={this.handleInputBedFileChange}
                            onSelectCollectionsChange={this.handleSelectCollectionsChange}
                            onInputSubmitClick={this.handleInputSubmit}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <ResultGroup
                            results={this.state.results}
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
    {value: 'reactome', name: 'c2.cp.reactome.v5.0.symbols', label: 'Pathways: REACTOME'},
    {value: 'biocarta', name: 'c2.cp.biocarta.v5.0.symbols', label: 'Pathways: BIOCARTA'},
    {value: 'kegg', name: 'c2.cp.kegg.v5.0.symbols', label: 'Pathways: KEGG'},
    {value: 'bp', name: 'c5.bp.v5.0.symbols', label: 'GO: Biological Process'},
    {value: 'mf', name: 'c5.mf.v5.0.symbols', label: 'GO: Molecular Function'},
    {value: 'cc', name: 'c5.cc.v5.0.symbols', label: 'GO: Cellular Component'},
    {value: 'hpo', name: 'cx.hpo.v5.0.symbols', label: 'Human Phenotype Ontology'},
    {value: 'malacards', name: 'cx.malacards.v5.0.symbols', label: 'MalaCards Disease Ontology'}
];

var explore = {
    clipdb: [
        {id: 'clipdb-nop58', symbol:'NOP58', name: 'NOP58'}
    ],
    encode: [
        {id: 'encode-prpf8', symbol:'PRPF8', name: 'Pre-MRNA Processing Factor 8'}
    ]
};

ReactDOM.render(<SetenApp collections={collections} explore={explore} />, document.querySelector('.container-app'));
