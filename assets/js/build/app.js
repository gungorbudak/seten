'use strict';

// polyfill for browsers lacking log10 method

Math.log10 = Math.log10 || function (x) {
    return Math.log(x) / Math.LN10;
};

var clickEvent = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': false
});

var PanelExploreItem = React.createClass({
    displayName: 'PanelExploreItem',

    componentDidMount: function componentDidMount(argument) {
        var item = this.getDOMNode();

        $(item).popover({
            trigger: 'hover',
            placement: 'auto',
            html: true,
            delay: { show: 50, hide: 100 }
        });
    },
    render: function render() {
        var item = this.props.item,
            dataContent = ['<p><strong>Symbol:</strong> ' + item.symbol + '</p>', '<p><strong>Cell line:</strong> ' + item.cellLine + '</p>', '<p><strong>Species:</strong> ' + item.species + '</p>', '<p><strong>Disease state:</strong> ' + item.diseaseState + '</p>'].join('');
        return React.createElement(
            'a',
            {
                href: '#',
                className: 'list-group-item',
                id: item.id,
                title: item.symbol + ' (' + item.cellLine + ') ',
                'data-content': dataContent,
                onClick: this.props.onExplore
            },
            item.symbol,
            ' (',
            item.cellLine,
            ')'
        );
    }
});

var PanelExplore = React.createClass({
    displayName: 'PanelExplore',

    render: function render() {
        var component = this;
        var clipdb = this.props.explore.clipdb;
        var encode = this.props.explore.encode;
        return React.createElement(
            'div',
            { className: 'panel panel-info panel-explore' },
            React.createElement(
                'div',
                { className: 'panel-heading' },
                React.createElement(
                    'h3',
                    { className: 'panel-title' },
                    React.createElement('i', { className: 'fa fa-globe' }),
                    '  Explore'
                )
            ),
            React.createElement(
                'div',
                { className: 'list-group list-group-explore' },
                React.createElement(
                    'div',
                    { className: 'list-group-item' },
                    React.createElement(
                        'h4',
                        { className: 'list-group-item-heading' },
                        'CLIPdb'
                    ),
                    React.createElement(
                        'p',
                        { className: 'list-group-item-text' },
                        'Precomputed gene set associations for RBPs from CLIPdb project.'
                    )
                ),
                clipdb.map(function (item) {
                    return React.createElement(PanelExploreItem, {
                        item: item,
                        onExplore: component.props.onExplore
                    });
                }),
                React.createElement(
                    'div',
                    { className: 'list-group-item' },
                    React.createElement(
                        'h4',
                        { className: 'list-group-item-heading' },
                        'ENCODE'
                    ),
                    React.createElement(
                        'p',
                        { className: 'list-group-item-text' },
                        'Precomputed gene set associations for RBPs from ENCODE project.'
                    )
                ),
                encode.map(function (item) {
                    return React.createElement(PanelExploreItem, {
                        item: item,
                        onExplore: component.props.onExplore
                    });
                })
            )
        );
    }
});

var InputBedFile = React.createClass({
    displayName: 'InputBedFile',

    componentDidMount: function componentDidMount(argument) {
        var el = this.getDOMNode(),
            buttons = el.querySelectorAll('.btn-explore');

        [].forEach.call(buttons, function (button) {
            $(button).popover({
                trigger: 'hover',
                placement: 'auto',
                html: true,
                delay: { show: 50, hide: 100 }
            });
        });
    },
    render: function render() {
        var component = this;
        return React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
                'label',
                { className: 'col-sm-2 control-label' },
                component.props.label
            ),
            React.createElement(
                'div',
                { className: 'col-sm-10' },
                React.createElement(
                    'div',
                    { className: 'input-group input-group-sm' },
                    React.createElement(
                        'span',
                        { className: 'input-group-btn' },
                        React.createElement(
                            'span',
                            {
                                className: 'btn btn-default btn-file',
                                disabled: component.props.disabled },
                            'Browse…',
                            React.createElement('input', {
                                type: 'file',
                                name: 'file',
                                onChange: component.props.onChange
                            })
                        )
                    ),
                    React.createElement('input', {
                        type: 'text',
                        className: 'form-control',
                        disabled: component.props.disabled,
                        value: component.props.inputBedFileName,
                        readOnly: true
                    })
                ),
                React.createElement(
                    'p',
                    { className: 'help-block-samples' },
                    React.createElement(
                        'span',
                        { className: 'text-muted' },
                        'Sample datasets'
                    ),
                    component.props.samples.map(function (item) {
                        var dataContent = ['<p><strong>Symbol:</strong> ' + item.symbol + '</p>', '<p><strong>Cell line:</strong> ' + item.cellLine + '</p>', '<p><strong>Species:</strong> ' + item.species + '</p>', '<p><strong>Disease state:</strong> ' + item.diseaseState + '</p>'].join('');
                        return React.createElement(
                            'a',
                            {
                                className: 'btn btn-link btn-xs btn-explore',
                                id: item.id,
                                title: item.symbol,
                                'data-content': dataContent,
                                onClick: component.props.onSampleClick
                            },
                            item.symbol
                        );
                    })
                )
            )
        );
    }
});

var SelectCollections = React.createClass({
    displayName: 'SelectCollections',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
                'label',
                { className: 'col-sm-2 control-label' },
                this.props.label
            ),
            React.createElement(
                'div',
                { className: 'col-sm-10' },
                React.createElement(
                    'select',
                    {
                        className: 'form-control',
                        multiple: 'multiple',
                        disabled: this.props.disabled,
                        onChange: this.props.onChange },
                    this.props.options.map(function (option) {
                        return React.createElement(
                            'option',
                            { value: option.id, id: option.filename },
                            option.name
                        );
                    })
                ),
                React.createElement(
                    'p',
                    { className: 'help-block' },
                    this.props.help
                )
            )
        );
    }
});

var PanelAnalyze = React.createClass({
    displayName: 'PanelAnalyze',

    render: function render() {
        var button;
        if (!this.props.disabled) {
            button = React.createElement(
                'button',
                {
                    className: 'btn btn-primary btn-sm',
                    disabled: this.props.disabled,
                    onClick: this.props.onInputSubmitClick
                },
                React.createElement('i', { className: 'fa fa-send' }),
                ' Submit'
            );
        } else {
            button = React.createElement(
                'button',
                {
                    className: 'btn btn-danger btn-sm',
                    disabled: !this.props.disabled,
                    onClick: this.props.onInputCancelClick
                },
                React.createElement('i', { className: 'fa fa-times-circle' }),
                ' Cancel'
            );
        }
        return React.createElement(
            'div',
            { className: 'panel panel-info panel-analyze' },
            React.createElement(
                'div',
                { className: 'panel-heading' },
                React.createElement(
                    'h3',
                    { className: 'panel-title' },
                    React.createElement('i', { className: 'fa fa-flask' }),
                    '  Analyze'
                )
            ),
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'div',
                    { className: 'form-horizontal' },
                    React.createElement(InputBedFile, {
                        label: 'BED file',
                        samples: this.props.samples,
                        disabled: this.props.disabled,
                        inputBedFileName: this.props.inputBedFileName,
                        onSampleClick: this.props.onSampleClick,
                        onChange: this.props.onInputBedFileChange
                    }),
                    React.createElement(SelectCollections, {
                        label: 'Collections',
                        options: this.props.collections,
                        help: 'Hold Ctrl to select multiple gene set collections',
                        disabled: this.props.disabled,
                        onChange: this.props.onSelectCollectionsChange
                    }),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'div',
                            { className: 'col-sm-offset-2 col-sm-10' },
                            button
                        )
                    )
                )
            )
        );
    }
});

var ResultBarChart = React.createClass({
    displayName: 'ResultBarChart',

    getChartState: function getChartState() {
        var panelWidth = 1138;
        var size = {
            margin: { top: 20, right: 10, bottom: 225, left: 50 }
        };
        size.width = panelWidth - size.margin.right - size.margin.left;
        size.height = 450 - size.margin.top - size.margin.bottom;
        return {
            size: size,
            data: this.props.data.map(function (el) {
                return {
                    // limit axis tick texts to 32 characters
                    n: el.geneSet.length > 32 ? el.geneSet.substr(0, 29) + '...' : el.geneSet,
                    // -Log10 tranformation of p-values
                    // for better visualization
                    val: -Math.log10(el.cPValue)
                };
            }),
            id: this.props.id
        };
    },
    renderChart: function renderChart(el, size, data) {
        data = data.sort(function (a, b) {
            return b.val - a.val;
        });

        var xScale = d3.scale.ordinal().rangeBands([0, size.width], 0.1).domain(data.map(function (d) {
            return d.n;
        }));

        var yScale = d3.scale.linear().range([size.height, 0]).domain([0, d3.max(data, function (d) {
            return d.val;
        })]);

        var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        var yAxis = d3.svg.axis().scale(yScale).orient("left");

        var chart = d3.select(el).selectAll('.chart');

        var x = chart.selectAll('.x').attr("transform", "translate(0," + size.height + ")").call(xAxis);

        x.selectAll("text").style("font", "10px sans-serif").style("text-anchor", "end").attr("dx", "-1em").attr("dy", "-0.5em").attr("transform", "rotate(-75)");

        x.selectAll("path").style("display", "none");

        x.selectAll("line").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

        var y = chart.selectAll('.y').call(yAxis);

        y.selectAll("path").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

        y.selectAll("line").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

        var bar = chart.selectAll('.bars').selectAll(".bar").data(data);

        bar.enter().append("rect").attr("class", "bar");

        bar.style("fill", "#F44336").attr("x", function (d) {
            return xScale(d.n);
        }).attr("width", xScale.rangeBand()).attr("y", function (d) {
            return yScale(d.val);
        }).attr("height", function (d) {
            return size.height - yScale(d.val);
        });

        bar.exit().remove();
    },
    updateChart: function updateChart(el, size, data) {
        this.renderChart(el, size, data);
    },
    createChart: function createChart(el, size, data, id) {
        var chart = d3.select(el).append("svg").attr("id", id).attr("width", size.width + size.margin.left + size.margin.right).attr("height", size.height + size.margin.top + size.margin.bottom).attr("xmlns", "http://www.w3.org/2000/svg").attr("version", "1.1").append("g").attr("class", "chart").attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");

        chart.append("g").attr("class", "bars");
        chart.append("g").attr("class", "x axis");
        chart.append("g").attr("class", "y axis").append("text").attr("transform", "rotate(-90)").attr("y", -40).attr("x", -(size.height / 2)).attr("dy", "1em").style("font", "10px sans-serif").style("text-anchor", "middle").text("-Log10(Comb. p-value)");

        this.updateChart(el, size, data);
    },
    componentDidMount: function componentDidMount() {
        var el = this.getDOMNode();
        var state = this.getChartState();
        this.createChart(el, state.size, state.data, state.id);
    },
    componentDidUpdate: function componentDidUpdate() {
        var el = this.getDOMNode();
        var state = this.getChartState();
        this.updateChart(el, state.size, state.data);
    },
    render: function render() {
        return React.createElement('div', { className: 'bar-chart' });
    }
});

var ResultModal = React.createClass({
    displayName: 'ResultModal',

    render: function render() {
        return React.createElement(
            'div',
            { 'class': 'modal fade', tabindex: '-1', role: 'dialog' },
            React.createElement(
                'div',
                { 'class': 'modal-dialog' },
                React.createElement(
                    'div',
                    { 'class': 'modal-content' },
                    React.createElement(
                        'div',
                        { 'class': 'modal-header' },
                        React.createElement(
                            'button',
                            { type: 'button', 'class': 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
                            React.createElement(
                                'span',
                                { 'aria-hidden': 'true' },
                                '×'
                            )
                        ),
                        React.createElement(
                            'h4',
                            { 'class': 'modal-title' },
                            'Genes'
                        )
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'modal-body' },
                        React.createElement(
                            'p',
                            null,
                            'One fine body…'
                        )
                    )
                )
            )
        );
    }
});

var SortIcon = React.createClass({
    displayName: 'SortIcon',

    render: function render() {
        var direction = this.props.direction.length > 0 ? "-" + this.props.direction : "";
        return React.createElement('i', { className: "fa fa-fw fa-sort" + direction });
    }
});

var ResultTable = React.createClass({
    displayName: 'ResultTable',

    render: function render() {
        var component = this,
            result = component.props.result,
            directions = component.props.sortDirections;

        if (result.enrichment.length > 0) {
            return React.createElement(
                'div',
                { className: 'table-responsive' },
                React.createElement(
                    'table',
                    { className: 'table table-striped table-hover table-panel' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                'Gene set'
                            ),
                            React.createElement(
                                'th',
                                {
                                    onClick: component.props.onSort,
                                    id: result.id + "-percent" },
                                '%',
                                React.createElement(SortIcon, { direction: directions.percent })
                            ),
                            React.createElement(
                                'th',
                                {
                                    onClick: component.props.onSort,
                                    id: result.id + "-fPValue" },
                                'Func. p-value',
                                React.createElement(SortIcon, { direction: directions.fPValue })
                            ),
                            React.createElement(
                                'th',
                                {
                                    onClick: component.props.onSort,
                                    id: result.id + "-fPValueCorr" },
                                'Func. p-value corr.',
                                React.createElement(SortIcon, { direction: directions.fPValueCorr })
                            ),
                            React.createElement(
                                'th',
                                {
                                    onClick: component.props.onSort,
                                    id: result.id + "-gSPValue" },
                                'G. set p-value',
                                React.createElement(SortIcon, { direction: directions.gSPValue })
                            ),
                            React.createElement(
                                'th',
                                {
                                    onClick: component.props.onSort,
                                    id: result.id + "-cPValue" },
                                'Comb. p-value',
                                React.createElement(SortIcon, { direction: directions.cPValue })
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        result.enrichment.map(function (row) {
                            var geneSet = row.geneSet;
                            if (geneSet.length > 45) {
                                geneSet = React.createElement(
                                    'abbr',
                                    { title: geneSet },
                                    geneSet.substr(0, 45)
                                );
                            }
                            return React.createElement(
                                'tr',
                                null,
                                React.createElement(
                                    'td',
                                    null,
                                    geneSet
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'abbr',
                                        { title: "Click to view " + row.overlapSize + "/" + row.geneSetSize + " genes",
                                            onClick: component.props.onViewGenes
                                        },
                                        row.percent
                                    )
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    row.fPValue.toPrecision(3)
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    row.fPValueCorr.toPrecision(3)
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    row.gSPValue.toPrecision(3)
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    row.cPValue.toPrecision(3)
                                )
                            );
                        })
                    )
                )
            );
        } else {
            return React.createElement(
                'div',
                { className: 'panel-body' },
                'No significant results available.'
            );
        }
    }
});

var Result = React.createClass({
    displayName: 'Result',

    render: function render() {
        var result = this.props.result,
            result = {
            id: result.id,
            title: result.title,
            enrichment: result.enrichment.filter(function (el) {
                return el.cPValue < 0.01;
            })
        },
            exportButtons,
            resultBarChart;

        if (result.enrichment.length > 0) {
            exportButtons = React.createElement(
                'div',
                { className: 'col-xs-6 text-right' },
                'Export  ',
                React.createElement('i', {
                    className: 'fa fa-bar-chart btn-export',
                    title: 'Export bar chart as SVG',
                    id: result.id,
                    onClick: this.props.onExportBarChart,
                    'aria-hidden': 'true'
                }),
                ' ',
                React.createElement('i', {
                    className: 'fa fa-table btn-export',
                    title: 'Export table as TSV',
                    id: result.id,
                    onClick: this.props.onExportTable,
                    'aria-hidden': 'true'
                })
            );
            resultBarChart = React.createElement(ResultBarChart, {
                id: result.id,
                data: result.enrichment
            });
        }
        return React.createElement(
            'div',
            { className: 'panel panel-primary' },
            React.createElement(
                'div',
                { className: 'panel-heading', role: 'tab', id: 'heading-' + result.id },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-xs-6' },
                        React.createElement(
                            'h4',
                            { className: 'panel-title' },
                            React.createElement(
                                'a',
                                {
                                    className: 'collapsed',
                                    role: 'button',
                                    'data-toggle': 'collapse',
                                    href: '#collapse-' + result.id,
                                    'aria-expanded': 'true',
                                    'aria-controls': 'collapse-' + result.id
                                },
                                result.title
                            ),
                            ' ',
                            React.createElement(
                                'span',
                                { className: 'badge' },
                                result.enrichment.length
                            )
                        )
                    ),
                    exportButtons
                )
            ),
            React.createElement(
                'div',
                {
                    id: 'collapse-' + result.id,
                    className: 'panel-collapse collapse',
                    role: 'tabpanel',
                    'aria-labelledby': 'heading-' + result.id
                },
                resultBarChart,
                React.createElement(ResultTable, {
                    result: result,
                    sortDirections: this.props.sortDirections,
                    onSort: this.props.onSort,
                    onViewGenes: this.props.onViewGenes
                })
            )
        );
    }
});

var ResultGroupProgressBar = React.createClass({
    displayName: 'ResultGroupProgressBar',

    render: function render() {
        if (this.props.show) {
            var barStyle = {
                minWidth: "2em",
                width: this.props.progress + "%"
            };
            return React.createElement(
                'div',
                { className: 'progress' },
                React.createElement(
                    'div',
                    {
                        className: 'progress-bar progress-bar-info progress-bar-striped active',
                        role: 'progressbar',
                        'aria-valuenow': this.props.progress,
                        'aria-valuemin': '0',
                        'aria-valuemax': '100',
                        style: barStyle
                    },
                    this.props.progress + "%"
                )
            );
        } else {
            return React.createElement('div', null);
        }
    }
});

var ResultGroupInfo = React.createClass({
    displayName: 'ResultGroupInfo',

    render: function render(argument) {
        var l = Object.keys(this.props.info).length;
        if (l) {
            if (l > 1) {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h3',
                        null,
                        this.props.info.symbol,
                        ' (',
                        this.props.info.cellLine,
                        ')'
                    ),
                    React.createElement(
                        'div',
                        { className: 'table-responsive' },
                        React.createElement(
                            'table',
                            { className: 'table' },
                            React.createElement(
                                'thead',
                                null,
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'th',
                                        null,
                                        'Symbol'
                                    ),
                                    React.createElement(
                                        'th',
                                        null,
                                        'Cell line'
                                    ),
                                    React.createElement(
                                        'th',
                                        null,
                                        'Species'
                                    ),
                                    React.createElement(
                                        'th',
                                        null,
                                        'Disease state'
                                    )
                                )
                            ),
                            React.createElement(
                                'tbody',
                                null,
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'td',
                                        null,
                                        this.props.info.symbol
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        this.props.info.cellLine
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        this.props.info.species
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        this.props.info.diseaseState
                                    )
                                )
                            )
                        )
                    )
                );
            } else {
                return React.createElement(
                    'h3',
                    null,
                    this.props.info.filename
                );
            }
        } else {
            return React.createElement('div', null);
        }
    }
});

var ResultGroup = React.createClass({
    displayName: 'ResultGroup',

    render: function render() {
        var component = this;
        return React.createElement(
            'div',
            null,
            React.createElement(ResultGroupProgressBar, {
                progress: component.props.progress,
                show: component.props.isRunning
            }),
            React.createElement(ResultGroupInfo, {
                info: component.props.resultsInfo
            }),
            React.createElement(
                'div',
                { className: 'panel-group', role: 'tablist', 'aria-multiselectable': 'true' },
                component.props.results.map(function (result) {
                    return React.createElement(Result, {
                        result: result,
                        sortDirections: component.props.sortDirections,
                        onSort: component.props.onSort,
                        onViewGenes: component.props.onViewGenes,
                        onExportBarChart: component.props.onExportBarChart,
                        onExportTable: component.props.onExportTable
                    });
                })
            )
        );
    }
});

var SetenApp = React.createClass({
    displayName: 'SetenApp',

    getInitialState: function getInitialState() {
        return {
            inputBedFile: undefined,
            inputBedFileName: '',
            inputCollections: undefined,
            workers: [],
            geneScores: [],
            geneCollections: [],
            results: [],
            resultsInfo: {},
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
    clearState: function clearState() {
        // clear some state variables
        this.setState({ workers: [] });
        this.setState({ results: [] });
        this.setState({ resultsInfo: {} });
        this.setState({ geneCollections: [] });
    },
    togglePanelAnalyze: function togglePanelAnalyze(e) {
        this.setState({ isRunning: !this.state.isRunning });
    },
    handleInputBedFileChange: function handleInputBedFileChange(e) {
        var file = e.target.files[0];
        this.setState({ inputBedFile: file });
        this.setState({ inputBedFileName: file.name });
    },
    handleSelectCollectionsChange: function handleSelectCollectionsChange(e) {
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
        this.setState({ inputCollections: collections });
    },
    handleInputSubmit: function handleInputSubmit(e) {
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
            this.setState({ resultsInfo: { filename: this.state.inputBedFileName } });
            // add worker to the state
            this.setState({ workers: this.state.workers.concat([mappingWorker]) });
        } else {
            console.log('Missing input...');
        }
    },
    handleInputCancel: function handleInputCancel(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to cancel this analysis?')) {
            var workers = this.state.workers;

            // terminate all available workers
            workers.forEach(function (worker) {
                worker.terminate();
            });
            // clear the state
            this.clearState();
            // enable the panel back
            this.togglePanelAnalyze();
        }
    },
    handleSample: function handleSample(e) {
        e.preventDefault();
        var sample = e.currentTarget.id,
            sampleWorker = new Worker('assets/js/workers/sample.js');

        sampleWorker.postMessage(sample);
        sampleWorker.onmessage = this.sampleWorkerOnMessage;
    },
    handleExplore: function handleExplore(e) {
        e.preventDefault();
        var component = this,
            result = e.currentTarget.id,
            exploreWorker = new Worker('assets/js/workers/explore.js');

        exploreWorker.postMessage({ result: result, collections: collections });
        exploreWorker.onmessage = function (e) {
            component.exploreWorkerOnMessage(e, result);
        };
    },
    handleSort: function handleSort(e) {
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
                results[i].enrichment = results[i].enrichment.sort(function (a, b) {
                    return order ? a[sort] - b[sort] : b[sort] - a[sort];
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

        this.setState({ results: _results });
        this.setState({ sortAscOrder: !order });
        this.setState({ sortDirections: _directions });
    },
    handleViewGenes: function handleViewGenes(e) {
        console.log('Viewing genes');
    },
    handleExportBarChart: function handleExportBarChart(e) {
        e.preventDefault();
        var id = e.currentTarget.id,
            query = 'svg#' + id,
            svg = document.querySelector(query),
            a = document.createElement('a');

        if (svg.outerHTML.length > 0) {
            var data = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
            a.href = window.URL.createObjectURL(data);
            a.setAttribute('download', id + '.svg');
            a.dispatchEvent(clickEvent);
            a.remove();
        }
    },
    handleExportTable: function handleExportTable(e) {
        e.preventDefault();
        var id = e.currentTarget.id,
            results = this.state.results,
            result;
        result = results.filter(function (result) {
            return result.id == id;
        });
        if (result.length == 1) {
            var tsv = ['Gene set', 'Overlap size', 'Gene set size', '%', 'Func. p-value', 'Func. p-value corr.', 'G. set p-value', 'Comb. p-value'].join('\t') + '\n';
            result[0].enrichment.forEach(function (row) {
                tsv += [row.geneSet, row.overlapSize, row.geneSetSize, row.percent, row.fPValue, row.fPValueCorr, row.gSPValue, row.cPValue].join('\t') + '\n';
            });
            var data = new Blob([tsv], { type: 'text/tsv' });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(data);
            a.setAttribute('download', result[0].id + '.tsv');
            a.dispatchEvent(clickEvent);
            a.remove();
        }
    },
    mappingWorkerOnMessage: function mappingWorkerOnMessage(e) {
        var geneScores = e.data,
            collections = this.props.collections,
            collectionWorker;

        // store gene scores in the state
        this.setState({ geneScores: geneScores });
        // collect all collections
        collectionWorker = new Worker('assets/js/workers/collection.js');
        collectionWorker.postMessage(collections);
        collectionWorker.onmessage = this.collectionWorkerOnMessage;
        // add worker to the state
        this.setState({ workers: this.state.workers.concat([collectionWorker]) });
    },
    collectionWorkerOnMessage: function collectionWorkerOnMessage(e) {
        var component = this,
            inputCollections = component.state.inputCollections,
            geneScores = component.state.geneScores,
            geneCollections = e.data,
            enrichmentWorker;

        // store gene collections in the state
        component.setState({ geneCollections: geneCollections });

        // start an enrichment worker for each collection
        inputCollections.forEach(function (inputCollection) {
            enrichmentWorker = new Worker('assets/js/workers/enrichment.js');
            enrichmentWorker.postMessage({
                'geneScores': geneScores,
                'geneCollection': geneCollections.collections[inputCollection.id],
                'geneCollectionsSize': geneCollections.size
            });
            enrichmentWorker.onmessage = component.enrichmentWorkerOnMessage;
            // add worker to the state
            component.setState({ workers: component.state.workers.concat([enrichmentWorker]) });
        });
    },
    enrichmentWorkerOnMessage: function enrichmentWorkerOnMessage(e) {
        var results = this.state.results.concat([e.data]);
        // add results to the state
        this.setState({ results: results });
        // check if job is complete
        if (this.state.results.length == this.state.inputCollections.length) {
            // enable the panel back
            this.togglePanelAnalyze();
        }
    },
    sampleWorkerOnMessage: function sampleWorkerOnMessage(e) {
        this.setState({ inputBedFile: e.data.file });
        this.setState({ inputBedFileName: e.data.name });
    },
    exploreWorkerOnMessage: function exploreWorkerOnMessage(e, result) {
        var resultsParent = this.props.explore[result.split('-')[0]],
            resultsInfo = resultsParent.filter(function (el) {
            return el.id == result;
        });
        this.setState({ resultsInfo: resultsInfo[0] });
        this.setState({ results: e.data });
    },
    render: function render() {
        var progress;
        if (this.state.inputCollections !== undefined) {
            progress = Math.round(this.state.results.length / this.state.inputCollections.length * 100);
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-4' },
                    React.createElement(PanelExplore, {
                        explore: this.props.explore,
                        onExplore: this.handleExplore
                    })
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-8' },
                    React.createElement(PanelAnalyze, {
                        collections: this.props.collections,
                        samples: this.props.samples,
                        disabled: this.state.isRunning,
                        inputBedFileName: this.state.inputBedFileName,
                        onInputBedFileChange: this.handleInputBedFileChange,
                        onSampleClick: this.handleSample,
                        onSelectCollectionsChange: this.handleSelectCollectionsChange,
                        onInputSubmitClick: this.handleInputSubmit,
                        onInputCancelClick: this.handleInputCancel
                    })
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-12' },
                    React.createElement(ResultGroup, {
                        results: this.state.results,
                        resultsInfo: this.state.resultsInfo,
                        progress: progress,
                        isRunning: this.state.isRunning,
                        sortDirections: this.state.sortDirections,
                        onSort: this.handleSort,
                        onViewGenes: this.handleViewGenes,
                        onExportBarChart: this.handleExportBarChart,
                        onExportTable: this.handleExportTable
                    })
                )
            )
        );
    }
});

var collections = [{ id: 'reactome', filename: 'c2.cp.reactome.v5.0.symbols', name: 'Pathways: REACTOME' }, { id: 'biocarta', filename: 'c2.cp.biocarta.v5.0.symbols', name: 'Pathways: BIOCARTA' }, { id: 'kegg', filename: 'c2.cp.kegg.v5.0.symbols', name: 'Pathways: KEGG' }, { id: 'bp', filename: 'c5.bp.v5.0.symbols', name: 'GO: Biological Process' }, { id: 'mf', filename: 'c5.mf.v5.0.symbols', name: 'GO: Molecular Function' }, { id: 'cc', filename: 'c5.cc.v5.0.symbols', name: 'GO: Cellular Component' }, { id: 'hpo', filename: 'cx.hpo.v5.0.symbols', name: 'Human Phenotype Ontology' }, { id: 'malacards', filename: 'cx.malacards.v5.0.symbols', name: 'MalaCards Disease Ontology' }];

var samples = [{ id: "FIP1L1_HEK293", symbol: "FIP1L1", name: "FIP1L1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "PRPF8_K562_ENCSR534YOI", symbol: "PRPF8", diseaseState: "Hepatocellular carcinoma", cellLine: "K562", species: "Human" }];

var explore = {
    clipdb: [{ id: "clipdb-AGO1_HEK293", symbol: "AGO1", name: "AGO1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-AGO2_LCL35", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL35", species: "Human" }, { id: "clipdb-AGO2_LCL-BAC-D2", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL-BAC-D2", species: "Human" }, { id: "clipdb-AGO2_LCL-BAC-D3", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL-BAC-D3", species: "Human" }, { id: "clipdb-AGO2_BCBL-1", symbol: "AGO2", name: "AGO2", diseaseState: "Primary effusion lymphoma", cellLine: "BCBL-1", species: "Human" }, { id: "clipdb-AGO2_LCL-BAC", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL-BAC", species: "Human" }, { id: "clipdb-AGO2_EF3D-AGO2", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "EF3D-AGO2", species: "Human" }, { id: "clipdb-AGO2_HeLa", symbol: "AGO2", name: "AGO2", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-AGO2_BC-1", symbol: "AGO2", name: "AGO2", diseaseState: "Primary effusion lymphoma", cellLine: "BC-1", species: "Human" }, { id: "clipdb-AGO2_HEK293S", symbol: "AGO2", name: "AGO2", diseaseState: "Cancer", cellLine: "HEK293S", species: "Human" }, { id: "clipdb-AGO2_BC-3", symbol: "AGO2", name: "AGO2", diseaseState: "Primary effusion lymphoma", cellLine: "BC-3", species: "Human" }, { id: "clipdb-AGO2_HEK293", symbol: "AGO2", name: "AGO2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-AGO2_LCL-BAC-D1", symbol: "AGO2", name: "AGO2", diseaseState: "Infected with EBV", cellLine: "LCL-BAC-D1", species: "Human" }, { id: "clipdb-AGO3_HEK293", symbol: "AGO3", name: "AGO3", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-AGO4_HEK293", symbol: "AGO4", name: "AGO4", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-ALKBH5_HEK293", symbol: "ALKBH5", name: "ALKBH5", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-C17orf85_HEK293", symbol: "C17orf85", name: "C17orf85", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CAPRIN1_HEK293", symbol: "CAPRIN1", name: "CAPRIN1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CPSF1_HEK293", symbol: "CPSF1", name: "CPSF1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CPSF2_HEK293", symbol: "CPSF2", name: "CPSF2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CPSF3_HEK293", symbol: "CPSF3", name: "CPSF3", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CPSF4_HEK293", symbol: "CPSF4", name: "CPSF4", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CPSF6_HEK293", symbol: "CPSF6", name: "CPSF6", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CPSF7_HEK293", symbol: "CPSF7", name: "CPSF7", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CSTF2_HeLa", symbol: "CSTF2", name: "CSTF2", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-CSTF2_HEK293", symbol: "CSTF2", name: "CSTF2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-CSTF2T_HEK293", symbol: "CSTF2T", name: "CSTF2T", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-DGCR8_HEK293T", symbol: "DGCR8", name: "DGCR8", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human" }, { id: "clipdb-EIF4A3_HeLa", symbol: "EIF4A3", name: "EIF4A3", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-ELAVL1_HEK293", symbol: "ELAVL1", name: "ELAVL1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-ELAVL1_HeLa", symbol: "ELAVL1", name: "ELAVL1", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-EZH2_HCT116", symbol: "EZH2", name: "EZH2", diseaseState: "Colorectal adenocarcinoma", cellLine: "HCT116", species: "Human" }, { id: "clipdb-FBL_HEK293", symbol: "FBL", name: "FBL", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-FIP1L1_HEK293", symbol: "FIP1L1", name: "FIP1L1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-FMR1_HEK293", symbol: "FMR1", name: "FMR1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-FXR1_HEK293", symbol: "FXR1", name: "FXR1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-FXR2_HEK293", symbol: "FXR2", name: "FXR2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-HNRNPA1_HEK293T", symbol: "HNRNPA1", name: "HNRNPA1", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human" }, { id: "clipdb-HNRNPA2B1_HEK293T", symbol: "HNRNPA2B1", name: "HNRNPA2B1", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human" }, { id: "clipdb-HNRNPC_HeLa", symbol: "HNRNPC", name: "HNRNPC", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-HNRNPF_HEK293T", symbol: "HNRNPF", name: "HNRNPF", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human" }, { id: "clipdb-HNRNPH_HEK293T", symbol: "HNRNPH1", name: "HNRNPH1", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human" }, { id: "clipdb-HNRNPM_HEK293T", symbol: "HNRNPM", name: "HNRNPM", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human" }, { id: "clipdb-HNRNPU_HEK293T", symbol: "HNRNPU", name: "HNRNPU", diseaseState: "Cancer", cellLine: "HEK293T", species: "Human" }, { id: "clipdb-HNRNPU_HeLa", symbol: "HNRNPU", name: "HNRNPU", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-IGF2BP1_HEK293", symbol: "IGF2BP1", name: "IGF2BP1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-IGF2BP2_HEK293", symbol: "IGF2BP2", name: "IGF2BP2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-IGF2BP3_HEK293", symbol: "IGF2BP3", name: "IGF2BP3", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-LIN28A_HEK293", symbol: "LIN28A", name: "LIN28A", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-LIN28A_H9", symbol: "LIN28A", name: "LIN28A", diseaseState: "Normal", cellLine: "H9", species: "Human" }, { id: "clipdb-LIN28B_HEK293", symbol: "LIN28B", name: "LIN28B", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-MOV10_HEK293", symbol: "MOV10", name: "MOV10", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-NOP56_HEK293", symbol: "NOP56", name: "NOP56", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-NOP58_HEK293", symbol: "NOP58", name: "NOP58", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-NUDT21_HEK293", symbol: "NUDT21", name: "NUDT21", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-PTBP1PTBP2_HeLa", symbol: "PTBP1/PTBP2", name: "PTBP1/PTBP2", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-PUM2_HEK293", symbol: "PUM2", name: "PUM2", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-QKI_HEK293", symbol: "QKI", name: "QKI", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-RTCB_HEK293", symbol: "RTCB", name: "RTCB", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-TARDBP_SH-SY5Y", symbol: "TARDBP", name: "TARDBP", diseaseState: "Metastatic neuroblastoma", cellLine: "SH-SY5Y", species: "Human" }, { id: "clipdb-TARDBP_H9", symbol: "TARDBP", name: "TARDBP", diseaseState: "Normal", cellLine: "H9", species: "Human" }, { id: "clipdb-TIA1_HeLa", symbol: "TIA1", name: "TIA1", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-TIAL1_HeLa", symbol: "TIAL1", name: "TIAL1", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-TNRC6A_HEK293", symbol: "TNRC6A", name: "TNRC6A", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-TNRC6B_HEK293", symbol: "TNRC6B", name: "TNRC6B", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-TNRC6C_HEK293", symbol: "TNRC6C", name: "TNRC6C", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "clipdb-YTHDF2_HeLa", symbol: "YTHDF2", name: "YTHDF2", diseaseState: "Cervical adenocarcinoma", cellLine: "HeLa", species: "Human" }, { id: "clipdb-ZC3H7B_HEK293", symbol: "ZC3H7B", name: "ZC3H7B", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }],
    encode: [{ id: 'encode-AUH_HepG2_ENCSR334QFR', symbol: 'AUH', name: 'AUH', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-AUH_K562_ENCSR541QHS', symbol: 'AUH', name: 'AUH', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-BCCIP_HepG2_ENCSR485QCG', symbol: 'BCCIP', name: 'BCCIP', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-CPSF6_K562_ENCSR532VUB', symbol: 'CPSF6', name: 'CPSF6', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-DDX42_K562_ENCSR576SHT', symbol: 'DDX42', name: 'DDX42', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-EIF4G1_K562_ENCSR961WWI', symbol: 'EIF4G1', name: 'EIF4G1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-EIF4G2_K562_ENCSR307YIW', symbol: 'EIF4G2', name: 'EIF4G2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-FKBP4_HepG2_ENCSR018ZUE', symbol: 'FKBP4', name: 'FKBP4', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-FMR1_K562_ENCSR331VNX', symbol: 'FMR1', name: 'FMR1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-FUS_K562_ENCSR477TRN', symbol: 'FUS', name: 'FUS', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-HNRNPA1_HepG2_ENCSR769UEW', symbol: 'HNRNPA1', name: 'HNRNPA1', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-HNRNPA1_K562_ENCSR154HRN', symbol: 'HNRNPA1', name: 'HNRNPA1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-HNRNPM_HepG2_ENCSR267UCX', symbol: 'HNRNPM', name: 'HNRNPM', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-HNRNPM_K562_ENCSR412NOW', symbol: 'HNRNPM', name: 'HNRNPM', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-HNRNPU_HepG2_ENCSR240MVJ', symbol: 'HNRNPU', name: 'HNRNPU', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-HNRNPU_K562_ENCSR520BZQ', symbol: 'HNRNPU', name: 'HNRNPU', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-IGF2BP1_HepG2_ENCSR744GEU', symbol: 'IGF2BP1', name: 'IGF2BP1', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-IGF2BP1_K562_ENCSR427DED', symbol: 'IGF2BP1', name: 'IGF2BP1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-IGF2BP1_K562_ENCSR975KIR', symbol: 'IGF2BP1', name: 'IGF2BP1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-IGF2BP2_K562_ENCSR062NNB', symbol: 'IGF2BP2', name: 'IGF2BP2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-IGF2BP2_K562_ENCSR193PVE', symbol: 'IGF2BP2', name: 'IGF2BP2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-IGF2BP3_HepG2_ENCSR993OLA', symbol: 'IGF2BP3', name: 'IGF2BP3', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-IGF2BP3_K562_ENCSR096IJV', symbol: 'IGF2BP3', name: 'IGF2BP3', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-LARP7_K562_ENCSR456KXI', symbol: 'LARP7', name: 'LARP7', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-PRPF8_K562_ENCSR534YOI', symbol: 'PRPF8', name: 'PRPF8', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-RBFOX2_HepG2_ENCSR987FTF', symbol: 'RBFOX2', name: 'RBFOX2', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-SAFB2_K562_ENCSR943MHU', symbol: 'SAFB2', name: 'SAFB2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-SLBP_K562_ENCSR483NOP', symbol: 'SLBP', name: 'SLBP', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-SLTM_K562_ENCSR000SSH', symbol: 'SLTM', name: 'SLTM', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-SRSF9_HepG2_ENCSR773KRC', symbol: 'SRSF9', name: 'SRSF9', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-TIA1_HepG2_ENCSR623VEQ', symbol: 'TIA1', name: 'TIA1', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-TIAL1_K562_ENCSR441YTO', symbol: 'TIAL1', name: 'TIAL1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-TRA2A_HepG2_ENCSR314UMJ', symbol: 'TRA2A', name: 'TRA2A', diseaseState: "Hepatocellular carcinoma", cellLine: 'HepG2', species: "Human" }, { id: 'encode-TRA2A_K562_ENCSR365NVO', symbol: 'TRA2A', name: 'TRA2A', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-U2AF1_K562_ENCSR862QCH', symbol: 'U2AF1', name: 'U2AF1', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-U2AF2_K562_ENCSR893RAV', symbol: 'U2AF2', name: 'U2AF2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }, { id: 'encode-XRN2_K562_ENCSR657TZB', symbol: 'XRN2', name: 'XRN2', diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: 'K562', species: "Human" }]
};

ReactDOM.render(React.createElement(SetenApp, {
    collections: collections,
    samples: samples,
    explore: explore
}), document.querySelector('.container-app'));