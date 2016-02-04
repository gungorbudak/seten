'use strict';

/*
* Seten source code for browser user interface
* Author: Gungor Budak
*/

// polyfill for browsers lacking log10 method

Math.log10 = Math.log10 || function (x) {
    return Math.log(x) / Math.LN10;
};

// cross-browser click event for exporting
var clickEvent = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': false
});

var PanelExploreItem = React.createClass({
    displayName: 'PanelExploreItem',

    componentDidMount: function componentDidMount() {
        var $item = $(this.getDOMNode());

        $item.find('button').popover({
            container: '.container-app',
            trigger: 'hover',
            placement: 'auto',
            html: true
        });
    },
    render: function render() {
        var item = this.props.item,
            itemSummary = ['<table class="table table-condensed table-popover">', '<tbody>', '<tr><th>Symbol</th><td>' + item.symbol + '</td></tr>', '<tr><th>Cell line</th><td>' + item.cellLine + '</td></tr>', '<tr><th>Species</th><td>' + item.species + '</td></tr>', '<tr><th>Disease state</th><td>' + item.diseaseState + '</td></tr>', '</tbody>', '</table>'].join('');
        return React.createElement(
            'div',
            { className: 'list-group-item' },
            React.createElement(
                'span',
                { className: 'label label-info', title: item.id.split('-')[0].toUpperCase() },
                item.id.substr(0, 1).toUpperCase()
            ),
            React.createElement(
                'button',
                {
                    href: '#',
                    className: 'btn btn-link btn-xs',
                    title: item.symbol + ' / ' + item.cellLine,
                    id: item.id,
                    'data-original-title': item.symbol + ' / ' + item.cellLine,
                    'data-content': itemSummary,
                    onClick: this.props.onExploreViewClick
                },
                item.symbol + ' / ' + item.cellLine
            )
        );
    }
});

var PanelExplore = React.createClass({
    displayName: 'PanelExplore',

    getInitialState: function getInitialState() {
        return {
            explore: this.props.explore
        };
    },
    handleSearchChange: function handleSearchChange(e) {
        var query = e.target.value.toLowerCase(),
            explore = this.props.explore;

        if (query.length > 0) {
            this.setState({ explore: explore.filter(function (item) {
                    return item.symbol.toLowerCase().startsWith(query);
                }) });
        } else {
            this.setState({ explore: explore });
        }
    },
    render: function render() {
        var component = this,
            items;

        if (component.state.explore.length > 0) {
            items = component.state.explore.map(function (item) {
                return React.createElement(PanelExploreItem, {
                    item: item,
                    onExploreViewClick: component.props.onExploreViewClick,
                    onExploreCompareClick: component.props.onExploreCompareClick
                });
            });
        } else {
            items = React.createElement(
                'div',
                { className: 'list-group-item' },
                'Your search did not match any RBPs.'
            );
        }

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
                    React.createElement(
                        'span',
                        null,
                        ' Explore'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'list-group' },
                React.createElement(
                    'div',
                    { className: 'list-group-item form-group has-feedback has-search' },
                    React.createElement('span', { className: 'glyphicon glyphicon-search form-control-feedback' }),
                    React.createElement('input', {
                        type: 'text',
                        className: 'form-control',
                        placeholder: 'Search for an RBP',
                        onChange: component.handleSearchChange
                    })
                )
            ),
            React.createElement(
                'div',
                { className: 'list-group list-group-explore' },
                items
            )
        );
    }
});

var PanelAnalyzeBedFile = React.createClass({
    displayName: 'PanelAnalyzeBedFile',

    componentDidMount: function componentDidMount(argument) {
        var $item = $(this.getDOMNode());

        $item.find('button').popover({
            container: '.container-app',
            trigger: 'hover',
            placement: 'auto',
            html: true
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
                    { className: 'help-block' },
                    'Sample datasets',
                    component.props.samples.map(function (item) {
                        var dataContent = ['<table class="table table-condensed table-popover">', '<tbody>', '<tr><th>Symbol</th><td>' + item.symbol + '</td></tr>', '<tr><th>Cell line</th><td>' + item.cellLine + '</td></tr>', '<tr><th>Species</th><td>' + item.species + '</td></tr>', '<tr><th>Disease state</th><td>' + item.diseaseState + '</td></tr>', '</tbody>', '</table>'].join('');
                        return React.createElement(
                            'button',
                            {
                                className: 'btn btn-link btn-xs',
                                id: item.id,
                                title: item.symbol + ' / ' + item.cellLine,
                                'data-original-title': item.symbol + ' / ' + item.cellLine,
                                'data-content': dataContent,
                                onClick: component.props.onInputSampleBedFileClick
                            },
                            item.symbol + ' / ' + item.cellLine
                        );
                    })
                )
            )
        );
    }
});

var PanelAnalyzeCollections = React.createClass({
    displayName: 'PanelAnalyzeCollections',

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
        var errors, button;

        if (this.props.inputErrors.length > 0) {
            errors = React.createElement(
                'div',
                { className: 'alert alert-danger', role: 'alert' },
                'Please correct following error(s);',
                React.createElement(
                    'ul',
                    null,
                    this.props.inputErrors.map(function (error) {
                        return React.createElement(
                            'li',
                            null,
                            error
                        );
                    })
                )
            );
        }

        if (!this.props.disabled) {
            button = React.createElement(
                'button',
                {
                    className: 'btn btn-primary btn-sm',
                    disabled: this.props.disabled,
                    onClick: this.props.onInputSubmitClick
                },
                React.createElement('i', { className: 'fa fa-send' }),
                React.createElement(
                    'span',
                    null,
                    ' Submit'
                )
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
                React.createElement(
                    'span',
                    null,
                    ' Cancel'
                )
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
                    React.createElement(
                        'span',
                        null,
                        ' Analyze'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'panel-body panel-body-analyze' },
                React.createElement(
                    'div',
                    { className: 'form-horizontal' },
                    React.createElement(PanelAnalyzeBedFile, {
                        label: 'BED file',
                        samples: this.props.samples,
                        disabled: this.props.disabled,
                        inputBedFileName: this.props.inputBedFileName,
                        onInputSampleBedFileClick: this.props.onInputSampleBedFileClick,
                        onChange: this.props.onInputBedFileChange
                    }),
                    React.createElement(PanelAnalyzeCollections, {
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
                            errors,
                            button
                        )
                    )
                )
            )
        );
    }
});

var ResultTitle = React.createClass({
    displayName: 'ResultTitle',

    render: function render() {
        return React.createElement(
            'h3',
            null,
            this.props.title
        );
    }
});

var ResultSummary = React.createClass({
    displayName: 'ResultSummary',

    render: function render() {
        return React.createElement(
            'div',
            null,
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
                                this.props.summary.symbol
                            ),
                            React.createElement(
                                'td',
                                null,
                                this.props.summary.cellLine
                            ),
                            React.createElement(
                                'td',
                                null,
                                this.props.summary.species
                            ),
                            React.createElement(
                                'td',
                                null,
                                this.props.summary.diseaseState
                            )
                        )
                    )
                )
            )
        );
    }
});

var ResultOptions = React.createClass({
    displayName: 'ResultOptions',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'form-inline' },
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    { className: 'text-muted' },
                    'Options'
                )
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    null,
                    'Percent >'
                ),
                React.createElement('input', {
                    type: 'text',
                    className: 'form-control input-sm',
                    id: this.props.resultId,
                    value: this.props.options.percent,
                    onChange: this.props.onOptionsPercentChange
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    null,
                    'Comb. p-value <'
                ),
                React.createElement('input', {
                    type: 'text',
                    className: 'form-control input-sm',
                    id: this.props.resultId,
                    value: this.props.options.cPValue,
                    onChange: this.props.onOptionsCPValueChange
                })
            )
        );
    }
});

var ResultCollectionBarChart = React.createClass({
    displayName: 'ResultCollectionBarChart',

    handleResize: function handleResize() {
        this.forceUpdate();
    },
    getChartState: function getChartState(width) {
        var panelWidth = width;
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

        var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(d3.format("d"));

        var chart = d3.select(el).select("svg").attr("width", size.width + size.margin.left + size.margin.right).attr("height", size.height + size.margin.top + size.margin.bottom).select(".chart");

        var x = chart.select('.x').attr("transform", "translate(0," + size.height + ")").call(xAxis);

        x.selectAll("text").style("font-family", "sans-serif").style("font-size", "10px").style("text-anchor", "end").attr("dx", "-1em").attr("dy", "-0.35em").attr("transform", "rotate(-75)");

        x.selectAll("path").style("display", "none");

        x.selectAll("line").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

        var y = chart.select('.y').call(yAxis);

        y.selectAll("text").style("font-family", "sans-serif").style("font-size", "10px");

        y.selectAll("path").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

        y.selectAll("line").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

        var bar = chart.select('.bars').selectAll(".bar").data(data);

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
        var svg = d3.select(el).append("svg").attr("id", id).attr("width", size.width + size.margin.left + size.margin.right).attr("height", size.height + size.margin.top + size.margin.bottom).attr("xmlns", "http://www.w3.org/2000/svg").attr("version", "1.1");
        // SVG's background rect
        svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "#ffffff");
        // actual chart
        var chart = svg.append("g").attr("class", "chart").attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");
        // data elements
        chart.append("g").attr("class", "bars");
        chart.append("g").attr("class", "x axis");
        chart.append("g").attr("class", "y axis").append("text").attr("transform", "rotate(-90)").attr("y", -40).attr("x", -(size.height / 2)).attr("dy", "1em").attr("dx", "0.35em").style("font-family", "sans-serif").style("font-size", "10px").style("text-anchor", "middle").text("-Log10(Comb. p-value)");
        // render the chart
        this.updateChart(el, size, data);
    },
    componentDidMount: function componentDidMount() {
        var el = this.getDOMNode(),
            width = el.parentNode.previousSibling.offsetWidth,
            state = this.getChartState(width);

        window.addEventListener('resize', this.handleResize);
        this.createChart(el, state.size, state.data, state.id);
    },
    componentDidUpdate: function componentDidUpdate() {
        var el = this.getDOMNode(),
            width = el.parentNode.previousSibling.offsetWidth,
            state = this.getChartState(width);
        this.updateChart(el, state.size, state.data);
    },
    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    render: function render() {
        return React.createElement('div', { className: 'bar-chart' });
    }
});

var ResultCollectionTableHeaderSortIcon = React.createClass({
    displayName: 'ResultCollectionTableHeaderSortIcon',

    render: function render() {
        var direction = this.props.direction !== null ? '-' + this.props.direction : '';
        return React.createElement('i', { className: "fa fa-fw fa-sort" + direction });
    }
});

var ResultCollectionTableHeader = React.createClass({
    displayName: 'ResultCollectionTableHeader',

    render: function render() {
        var component = this,
            sort = component.props.sort,
            items,
            direction;

        items = component.props.columns.map(function (column) {
            if (column.id == sort.id) {
                direction = sort.direction;
            } else {
                direction = null;
            }
            return React.createElement(
                'th',
                {
                    id: column.id,
                    className: 'sortable',
                    onClick: component.props.onSortClick
                },
                column.name,
                React.createElement(ResultCollectionTableHeaderSortIcon, { direction: direction })
            );
        });

        return React.createElement(
            'thead',
            null,
            React.createElement(
                'tr',
                null,
                items
            )
        );
    }
});

var ResultCollectionTableBody = React.createClass({
    displayName: 'ResultCollectionTableBody',

    render: function render() {
        return React.createElement(
            'tbody',
            null,
            this.props.data.map(function (row) {
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
                            {
                                title: row.overlapSize + "/" + row.geneSetSize
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
        );
    }
});

var ResultCollectionTable = React.createClass({
    displayName: 'ResultCollectionTable',

    getInitialState: function getInitialState() {
        return {
            sort: {
                id: 'cPValue',
                direction: 'asc'
            },
            columns: [{ id: 'geneSet', name: 'Gene set' }, { id: 'percent', name: '%' }, { id: 'fPValue', name: 'Func. p-value' }, { id: 'fPValueCorr', name: 'Func. p-value corr.' }, { id: 'gSPValue', name: 'G. set p-value' }, { id: 'cPValue', name: 'Comb. p-value' }]
        };
    },
    handleSortClick: function handleSortClick(e) {
        var id = e.currentTarget.id,
            sort = this.state.sort;
        // new sort object
        var _sort = {
            id: id,
            direction: sort.direction == 'asc' ? 'desc' : 'asc'
        };
        // replace sort with the new sort object
        this.setState({
            sort: _sort
        });
    },
    render: function render() {
        var component = this,
            data = component.props.data,
            sort = component.state.sort,
            columns = component.state.columns;
        // sort data according to sort object in the state
        data = data.sort(function (a, b) {
            return sort.direction == 'asc' ? a[sort.id] - b[sort.id] : b[sort.id] - a[sort.id];
        });
        // is there any data?
        if (data.length > 0) {
            return React.createElement(
                'div',
                { className: 'table-responsive table-responsive-panel' },
                React.createElement(
                    'table',
                    { className: 'table table-striped table-hover table-panel' },
                    React.createElement(ResultCollectionTableHeader, {
                        columns: columns,
                        sort: sort,
                        onSortClick: component.handleSortClick
                    }),
                    React.createElement(ResultCollectionTableBody, {
                        data: data
                    })
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

var ResultCollection = React.createClass({
    displayName: 'ResultCollection',

    render: function render() {
        var component = this,
            collection = component.props.collection,
            uniqueId = component.props.resultId + '__' + collection.id,
            data = collection.data.filter(function (item) {
            return item.percent > component.props.options.percent && item.cPValue < component.props.options.cPValue;
        }),
            exportButtons,
            barChart;
        // is there any data?
        if (data.length > 0) {
            exportButtons = React.createElement(
                'div',
                { className: 'col-xs-4 text-right' },
                React.createElement(
                    'span',
                    { className: 'hidden-xs' },
                    'Export '
                ),
                React.createElement(
                    'button',
                    {
                        className: 'btn btn-default btn-xs',
                        id: uniqueId,
                        onClick: component.props.onExportBarChartClick,
                        title: 'Export bar chart as SVG'
                    },
                    React.createElement('i', { className: 'fa fa-bar-chart fa-fw' })
                ),
                ' ',
                React.createElement(
                    'button',
                    {
                        className: 'btn btn-default btn-xs',
                        id: uniqueId,
                        onClick: component.props.onExportTableClick,
                        title: 'Export table as TSV'
                    },
                    React.createElement('i', { className: 'fa fa-table fa-fw' })
                )
            );
            barChart = React.createElement(ResultCollectionBarChart, {
                id: uniqueId,
                data: data
            });
        }
        return React.createElement(
            'div',
            { className: 'panel panel-primary' },
            React.createElement(
                'div',
                { className: 'panel-heading', role: 'tab', id: 'heading-' + uniqueId },
                React.createElement(
                    'div',
                    { className: 'row flex-align flex-align-center' },
                    React.createElement(
                        'div',
                        { className: 'col-xs-8' },
                        React.createElement(
                            'h4',
                            { className: 'panel-title' },
                            React.createElement(
                                'span',
                                { className: 'badge' },
                                data.length
                            ),
                            ' ',
                            React.createElement(
                                'a',
                                {
                                    className: 'collapsed',
                                    role: 'button',
                                    'data-toggle': 'collapse',
                                    href: '#collapse-' + uniqueId,
                                    'aria-expanded': 'true',
                                    'aria-controls': 'collapse-' + uniqueId
                                },
                                collection.title
                            )
                        )
                    ),
                    exportButtons
                )
            ),
            React.createElement(
                'div',
                {
                    id: 'collapse-' + uniqueId,
                    className: 'panel-collapse collapse',
                    role: 'tabpanel',
                    'aria-labelledby': 'heading-' + uniqueId
                },
                barChart,
                React.createElement(ResultCollectionTable, {
                    collection: collection,
                    data: data
                })
            )
        );
    }
});

var Result = React.createClass({
    displayName: 'Result',

    render: function render() {
        var component = this,
            summary,
            options;

        if (component.props.result.summary != null) {
            summary = React.createElement(ResultSummary, {
                summary: component.props.result.summary
            });
        }

        if (component.props.result.collections.length > 0) {
            options = React.createElement(ResultOptions, {
                resultId: component.props.result.id,
                options: component.props.result.options,
                onOptionsPercentChange: component.props.onOptionsPercentChange,
                onOptionsCPValueChange: component.props.onOptionsCPValueChange
            });
        }

        return React.createElement(
            'div',
            null,
            React.createElement(ResultTitle, {
                title: component.props.result.title
            }),
            summary,
            options,
            React.createElement(
                'div',
                { className: 'panel-group', 'aria-multiselectable': 'true' },
                component.props.result.collections.map(function (collection) {
                    return React.createElement(ResultCollection, {
                        resultId: component.props.result.id,
                        collection: collection,
                        options: component.props.result.options,
                        onExportBarChartClick: component.props.onExportBarChartClick,
                        onExportTableClick: component.props.onExportTableClick
                    });
                })
            )
        );
    }
});

var ResultGroupCompareCollections = React.createClass({
    displayName: 'ResultGroupCompareCollections',

    componentDidMount: function componentDidMount() {
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
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'span',
                { className: 'hidden-xs' },
                'Collections '
            ),
            React.createElement(
                'select',
                {
                    className: 'form-control',
                    multiple: 'multiple' },
                this.props.options.map(function (option) {
                    return React.createElement(
                        'option',
                        {
                            value: option.id,
                            selected: option.selected },
                        option.name
                    );
                })
            )
        );
    }
});

var ResultGroupTitle = React.createClass({
    displayName: 'ResultGroupTitle',

    render: function render() {
        var title = this.props.compare ? 'Compare' : 'View',
            toggle = this.props.compare ? 'toggle-on' : 'toggle-off',
            compareCollections,
            compareExport;

        if (this.props.compare) {
            compareCollections = React.createElement(
                'li',
                null,
                React.createElement(ResultGroupCompareCollections, {
                    options: this.props.collections,
                    onCompareCollectionsChange: this.props.onCompareCollectionsChange
                })
            );
            compareExport = React.createElement(
                'li',
                null,
                React.createElement(
                    'button',
                    {
                        className: 'btn btn-default btn-xs',
                        title: 'Export as SVG',
                        onClick: this.props.onCompareExportClick },
                    React.createElement('i', { className: 'fa fa-external-link fa-fw' }),
                    React.createElement(
                        'span',
                        { className: 'hidden-xs' },
                        ' Export'
                    )
                )
            );
        }

        return React.createElement(
            'div',
            { className: 'row flex-align' },
            React.createElement(
                'div',
                { className: 'col-xs-3 flex-align-bottom' },
                React.createElement(
                    'h2',
                    null,
                    title
                )
            ),
            React.createElement(
                'div',
                { className: 'col-xs-9 text-right flex-align-bottom' },
                React.createElement(
                    'ul',
                    { className: 'list-inline list-inline-options' },
                    compareCollections,
                    compareExport,
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'button',
                            {
                                className: 'btn btn-default btn-xs',
                                title: 'Clear results',
                                onClick: this.props.onResultsClearClick },
                            React.createElement('i', { className: 'fa fa-trash fa-fw' }),
                            React.createElement(
                                'span',
                                { className: 'hidden-xs' },
                                ' Clear'
                            )
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'button',
                            {
                                className: 'btn btn-default btn-xs',
                                title: 'Toggle view/compare',
                                onClick: this.props.onResultsCompareClick },
                            React.createElement('i', { className: "fa fa-" + toggle + " fa-fw" }),
                            React.createElement(
                                'span',
                                { className: 'hidden-xs' },
                                ' Compare'
                            )
                        )
                    )
                )
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

var ResultGroupBubbleChart = React.createClass({
    displayName: 'ResultGroupBubbleChart',

    handleResize: function handleResize() {
        this.forceUpdate();
    },
    getChartState: function getChartState(width) {
        var component = this,
            margin = { top: 150, right: 20, bottom: 20, left: 225 },
            collections = this.props.collections.filter(function (collection) {
            return collection.selected === true;
        }).map(function (collection) {
            return collection.id;
        }),
            data = [];

        component.props.results.forEach(function (result) {
            result.collections.forEach(function (collection) {
                if (collections.indexOf(collection.id) !== -1) {
                    collection.data.forEach(function (row) {
                        if (row.cPValue < result.options.cPValue && row.percent > result.options.percent) {
                            data.push({
                                sample: result.title.length > 21 ? result.title.substr(0, 18) + '...' : result.title,
                                geneSet: row.geneSet.length > 32 ? row.geneSet.substr(0, 29) + '...' : row.geneSet,
                                cPValue: row.cPValue
                            });
                        }
                    });
                }
            });
        });

        var heightFactor = data.reduce(function (p, c) {
            if (p.indexOf(c.geneSet) < 0) p.push(c.geneSet);
            return p;
        }, []).length;

        var size = {
            width: width - margin.left - margin.right,
            height: 30 * heightFactor,
            margin: margin
        };

        return {
            size: size,
            data: data
        };
    },
    renderChart: function renderChart(el, size, data) {
        var xScale = d3.scale.ordinal().rangePoints([0, size.width], 1).domain(data.map(function (d) {
            return d.sample;
        }));

        var yScale = d3.scale.ordinal().rangePoints([0, size.height], 1).domain(data.map(function (d) {
            return d.geneSet;
        }));

        var xAxis = d3.svg.axis().scale(xScale).orient("top").innerTickSize(-(size.height + 6));

        var yAxis = d3.svg.axis().scale(yScale).orient("left").innerTickSize(-(size.width + 6));

        var height = size.height > 0 ? size.height + size.margin.top + size.margin.bottom : 0;

        var chart = d3.select(el).select("svg").attr("width", size.width + size.margin.left + size.margin.right).attr("height", height).select(".chart");

        var x = chart.select(".x").call(xAxis);

        x.selectAll("path").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

        x.selectAll("line").attr("transform", "translate(0,-6)").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges").style("opacity", 0.2);

        x.selectAll("text").style("font-family", "sans-serif").style("font-size", "10px").style("text-anchor", "start").attr("dx", "1em").attr("dy", "0.35em").attr("transform", "rotate(-75)");

        var y = chart.select(".y").call(yAxis);

        y.selectAll("path").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

        y.selectAll("line").attr("transform", "translate(-6,0)").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges").style("opacity", 0.2);

        y.selectAll("text").style("font-family", "sans-serif").style("font-size", "10px").style("text-anchor", "end").attr("dx", "-1em").attr("dy", "0.35em");

        var bubble = chart.select('.bubbles').selectAll(".bubble").data(data);

        bubble.enter().append("circle").attr("class", "bubble");

        bubble.attr("r", function (d) {
            return -Math.log10(d.cPValue);
        }).attr("transform", function (d) {
            return "translate(" + xScale(d.sample) + "," + yScale(d.geneSet) + ")";
        }).style("fill", "#F44336");

        bubble.exit().remove();
    },
    updateChart: function updateChart(el, size, data) {
        this.renderChart(el, size, data);
    },
    createChart: function createChart(el, size, data) {
        var svg = d3.select(el).append("svg").attr("id", "bubble-chart").attr("width", size.width + size.margin.left + size.margin.right).attr("height", size.height + size.margin.top + size.margin.bottom).attr("xmlns", "http://www.w3.org/2000/svg").attr("version", "1.1");
        // SVG's background rect
        svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "#ffffff");
        // actual chart
        var chart = svg.append("g").attr("class", "chart").attr("transform", "translate(" + size.margin.left + "," + size.margin.top + ")");
        // data elements
        chart.append("g").attr("class", "x axis");
        chart.append("g").attr("class", "y axis");
        chart.append("g").attr("class", "bubbles");
        // render the chart
        this.updateChart(el, size, data);
    },
    componentDidMount: function componentDidMount() {
        var el = this.getDOMNode(),
            width = el.offsetWidth,
            state = this.getChartState(width);

        window.addEventListener('resize', this.handleResize);
        this.createChart(el, state.size, state.data);
    },
    componentDidUpdate: function componentDidUpdate() {
        var el = this.getDOMNode(),
            width = el.offsetWidth,
            state = this.getChartState(width);

        this.updateChart(el, state.size, state.data);
    },
    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    render: function render() {
        return React.createElement('div', { className: 'bubble-chart' });
    }
});

var ResultGroup = React.createClass({
    displayName: 'ResultGroup',

    render: function render() {
        var component = this,
            view;

        if (component.props.results.length > 0) {
            if (component.props.compare) {
                view = React.createElement(ResultGroupBubbleChart, {
                    results: component.props.results,
                    collections: component.props.collections
                });
            } else {
                view = component.props.results.map(function (result) {
                    return React.createElement(
                        'div',
                        null,
                        React.createElement(Result, {
                            result: result,
                            progress: component.props.progress,
                            isRunning: component.props.isRunning,
                            onOptionsPercentChange: component.props.onOptionsPercentChange,
                            onOptionsCPValueChange: component.props.onOptionsCPValueChange,
                            onExportBarChartClick: component.props.onExportBarChartClick,
                            onExportTableClick: component.props.onExportTableClick
                        }),
                        React.createElement('hr', null)
                    );
                });
            }

            return React.createElement(
                'div',
                null,
                React.createElement(ResultGroupTitle, {
                    compare: component.props.compare,
                    collections: component.props.collections,
                    onCompareCollectionsChange: component.props.onCompareCollectionsChange,
                    onCompareExportClick: component.props.onCompareExportClick,
                    onResultsClearClick: component.props.onResultsClearClick,
                    onResultsCompareClick: component.props.onResultsCompareClick
                }),
                React.createElement('hr', null),
                React.createElement(ResultGroupProgressBar, {
                    progress: component.props.progress,
                    show: component.props.isRunning
                }),
                view
            );
        } else {
            return React.createElement('div', null);
        }
    }
});

var SetenApp = React.createClass({
    displayName: 'SetenApp',

    getInitialState: function getInitialState() {
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
        getDefaultResultOptions: function getDefaultResultOptions() {
            return {
                percent: 5,
                cPValue: 0.01
            };
        },
        getIdFromFileName: function getIdFromFileName(fileName) {
            return fileName.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
        }
    },
    resetSomeState: function resetSomeState() {
        // reset some state variables
        this.setState({ workers: [] });
        this.setState({ geneScores: [] });
        this.setState({ geneCollections: [] });
        this.setState({ runningResult: undefined });
    },
    togglePanelAnalyze: function togglePanelAnalyze(e) {
        this.setState({ isRunning: !this.state.isRunning });
    },
    cancelAnalysis: function cancelAnalysis() {
        var workers = this.state.workers,
            results = this.state.results,
            runningResult = this.state.runningResult,
            l = results.length;

        // terminate all available workers
        workers.forEach(function (worker) {
            worker.terminate();
        });
        this.setState({ results: results });
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
    completeAnalysis: function completeAnalysis() {
        var workers = this.state.workers;

        // terminate all available workers
        workers.forEach(function (worker) {
            worker.terminate();
        });
        // reset some state variables
        this.resetSomeState();
        // enable the panel back
        this.togglePanelAnalyze();
    },
    handleCompareCollectionsChange: function handleCompareCollectionsChange(e) {
        var selection = e,
            collections = this.state.collections;
        // select all is checked/unchecked or
        // user checked/unchecked all one by one
        if (selection === true || selection === false) {
            collections = collections.map(function (collection) {
                collection.selected = selection;
                return collection;
            });
        } else {
            // single option is checked or unchecked
            var option = selection.get(0);

            collections = collections.map(function (collection) {
                if (collection.id == option.value) {
                    collection.selected = !collection.selected;
                }
                return collection;
            });
        }

        this.setState({ collections: collections });
    },
    handleCompareExportClick: function handleCompareExportClick(e) {
        e.preventDefault();
        var id = 'bubble-chart',
            svg = document.querySelector('svg#' + id),
            a = document.createElement('a');

        if (svg.outerHTML.length > 0) {
            var data = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
            a.href = window.URL.createObjectURL(data);
            a.setAttribute('download', id + '.svg');
            a.dispatchEvent(clickEvent);
            a.remove();
        }
    },
    handleResultsClearClick: function handleResultsClearClick(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to clear all results?')) {
            this.setState({ results: [] });
            this.setState({ compare: false });
        }
    },
    handleResultsCompareClick: function handleResultsCompareClick(e) {
        e.preventDefault();
        this.setState({ compare: !this.state.compare });
    },
    handleExploreViewClick: function handleExploreViewClick(e) {
        e.preventDefault();
        var resultId = e.currentTarget.id,
            exploreWorker = new Worker('assets/js/workers/explore.js');

        exploreWorker.postMessage({ resultId: resultId, collections: this.state.collections });
        exploreWorker.onmessage = this.exploreWorkerOnMessage;
    },
    handleInputSampleBedFileClick: function handleInputSampleBedFileClick(e) {
        e.preventDefault();
        var sample = e.currentTarget.id,
            sampleWorker = new Worker('assets/js/workers/sample.js');

        sampleWorker.postMessage(sample);
        sampleWorker.onmessage = this.sampleWorkerOnMessage;
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
    handleInputSubmitClick: function handleInputSubmitClick(e) {
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
            this.setState({ inputErrors: errors });
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
            this.setState({ inputErrors: [] });
            // toggle form
            this.togglePanelAnalyze();
            // initiate a running result variable
            results.unshift(runningResult);
            this.setState({ results: results });
            this.setState({ runningResult: runningResult });
            // start mapping worker to read and map the file
            mappingWorker.postMessage(bedFile);
            mappingWorker.onmessage = this.mappingWorkerOnMessage;
            // add worker to the state
            this.setState({ workers: this.state.workers.concat([mappingWorker]) });
        }
    },
    handleInputCancelClick: function handleInputCancelClick(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to cancel this analysis?')) {
            this.cancelAnalysis();
        }
    },
    handleOptionsPercentChange: function handleOptionsPercentChange(e) {
        var percent = e.target.value,
            resultId = e.target.id,
            results = this.state.results;

        results = results.map(function (result) {
            if (result.id == resultId) {
                result.options.percent = percent;
            }
            return result;
        });

        this.setState({ results: results });
    },
    handleOptionsCPValueChange: function handleOptionsCPValueChange(e) {
        var cPValue = e.target.value,
            resultId = e.target.id,
            results = this.state.results;

        results = results.map(function (result) {
            if (result.id == resultId) {
                result.options.cPValue = cPValue;
            }
            return result;
        });

        this.setState({ results: results });
    },
    handleExportBarChartClick: function handleExportBarChartClick(e) {
        e.preventDefault();
        var id = e.currentTarget.id,
            svg = document.querySelector('svg#' + id),
            a = document.createElement('a');

        if (svg.outerHTML.length > 0) {
            var data = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
            a.href = window.URL.createObjectURL(data);
            a.setAttribute('download', id + '.svg');
            a.dispatchEvent(clickEvent);
            a.remove();
        }
    },
    handleExportTableClick: function handleExportTableClick(e) {
        e.preventDefault();
        var id = e.currentTarget.id,
            resultId = id.split('__')[0],
            collId = id.split('__')[1],
            results = this.state.results,
            result,
            collection;

        result = results.filter(function (result) {
            return result.id == resultId;
        })[0];

        collection = result.collections.filter(function (coll) {
            return coll.id = collId;
        })[0];

        var tsv = ['Gene set', 'Genes', 'Overlap size', 'Gene set size', '%', 'Func. p-value', 'Func. p-value corr.', 'G. set p-value', 'Comb. p-value'].join('\t') + '\n';
        collection.data.forEach(function (row) {
            tsv += [row.geneSet, row.genes.join(', '), row.overlapSize, row.geneSetSize, row.percent, row.fPValue, row.fPValueCorr, row.gSPValue, row.cPValue].join('\t') + '\n';
        });
        var data = new Blob([tsv], { type: 'text/tsv' });
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(data);
        a.setAttribute('download', id + '.tsv');
        a.dispatchEvent(clickEvent);
        a.remove();
    },
    exploreWorkerOnMessage: function exploreWorkerOnMessage(e) {
        var component = this,
            results = component.state.results,
            result = e.data;
        // add missing result attributes
        result['summary'] = component.props.explore.filter(function (item) {
            return item.id == result.id;
        })[0];
        result['title'] = result.summary.symbol + ' / ' + result.summary.cellLine;
        result['options'] = component.constructor.getDefaultResultOptions();
        // add the complete result to the results in the state
        results.unshift(result);
        component.setState({ results: results });
    },
    sampleWorkerOnMessage: function sampleWorkerOnMessage(e) {
        this.setState({ inputBedFile: e.data.file });
        this.setState({ inputBedFileName: e.data.name });
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
        var currColl = e.data,
            results = this.state.results,
            runningResult = this.state.runningResult;
        // add current collection to the running result in the state
        runningResult.collections.push(currColl);
        // update running result in results in the state
        this.setState({ results: results.map(function (result) {
                // update the running result element in results
                if (result.id == runningResult.id) {
                    result = runningResult;
                }
                return result;
            }) });
        // check if job is complete
        if (runningResult.collections.length == this.state.inputCollections.length) {
            this.completeAnalysis();
        }
    },
    render: function render() {
        var progress;
        if (this.state.runningResult !== undefined && this.state.inputCollections !== undefined) {
            progress = Math.round(this.state.runningResult.collections.length / this.state.inputCollections.length * 100);
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
                        onExploreSearchChange: this.handleExploreSearchChange,
                        onExploreViewClick: this.handleExploreViewClick,
                        onExploreCompareClick: this.handleExploreCompareClick
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
                        inputErrors: this.state.inputErrors,
                        onInputBedFileChange: this.handleInputBedFileChange,
                        onInputSampleBedFileClick: this.handleInputSampleBedFileClick,
                        onSelectCollectionsChange: this.handleSelectCollectionsChange,
                        onInputSubmitClick: this.handleInputSubmitClick,
                        onInputCancelClick: this.handleInputCancelClick
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
                        collections: this.props.collections,
                        compare: this.state.compare,
                        progress: progress,
                        isRunning: this.state.isRunning,
                        onCompareCollectionsChange: this.handleCompareCollectionsChange,
                        onCompareExportClick: this.handleCompareExportClick,
                        onResultsClearClick: this.handleResultsClearClick,
                        onResultsCompareClick: this.handleResultsCompareClick,
                        onOptionsPercentChange: this.handleOptionsPercentChange,
                        onOptionsCPValueChange: this.handleOptionsCPValueChange,
                        onExportBarChartClick: this.handleExportBarChartClick,
                        onExportTableClick: this.handleExportTableClick
                    })
                )
            )
        );
    }
});

var collections = [{ id: 'reactome', filename: 'c2.cp.reactome.v5.0.symbols', name: 'Pathways: REACTOME', selected: false }, { id: 'biocarta', filename: 'c2.cp.biocarta.v5.0.symbols', name: 'Pathways: BIOCARTA', selected: false }, { id: 'kegg', filename: 'c2.cp.kegg.v5.0.symbols', name: 'Pathways: KEGG', selected: false }, { id: 'bp', filename: 'c5.bp.v5.0.symbols', name: 'GO: Biological Process', selected: false }, { id: 'mf', filename: 'c5.mf.v5.0.symbols', name: 'GO: Molecular Function', selected: false }, { id: 'cc', filename: 'c5.cc.v5.0.symbols', name: 'GO: Cellular Component', selected: false }, { id: 'hpo', filename: 'cx.hpo.v5.0.symbols', name: 'Human Phenotype Ontology', selected: false }, { id: 'malacards', filename: 'cx.malacards.v5.0.symbols', name: 'MalaCards Disease Ontology', selected: true }];

var samples = [{ id: "FIP1L1_HEK293", symbol: "FIP1L1", name: "FIP1L1", diseaseState: "Cancer", cellLine: "HEK293", species: "Human" }, { id: "PRPF8_K562", symbol: "PRPF8", diseaseState: "Chronic myelogenous leukemia (CML)", cellLine: "K562", species: "Human" }];

var explore = [{ id: 'clipdb-AGO1_HEK293', symbol: 'AGO1', name: 'AGO1', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-AGO2_BC-1', symbol: 'AGO2', name: 'AGO2', cellLine: 'BC-1', diseaseState: 'Primary effusion lymphoma', species: 'Human' }, { id: 'clipdb-AGO2_HeLa', symbol: 'AGO2', name: 'AGO2', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'clipdb-AGO2_HEK293', symbol: 'AGO2', name: 'AGO2', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-AGO2_BC-3', symbol: 'AGO2', name: 'AGO2', cellLine: 'BC-3', diseaseState: 'Primary effusion lymphoma', species: 'Human' }, { id: 'clipdb-AGO2_LCL-BAC-D3', symbol: 'AGO2', name: 'AGO2', cellLine: 'LCL-BAC-D3', diseaseState: 'Infected with EBV', species: 'Human' }, { id: 'clipdb-AGO2_LCL35', symbol: 'AGO2', name: 'AGO2', cellLine: 'LCL35', diseaseState: 'Infected with EBV', species: 'Human' }, { id: 'clipdb-AGO2_LCL-BAC-D1', symbol: 'AGO2', name: 'AGO2', cellLine: 'LCL-BAC-D1', diseaseState: 'Infected with EBV', species: 'Human' }, { id: 'clipdb-AGO2_BCBL-1', symbol: 'AGO2', name: 'AGO2', cellLine: 'BCBL-1', diseaseState: 'Primary effusion lymphoma', species: 'Human' }, { id: 'clipdb-AGO2_HEK293S', symbol: 'AGO2', name: 'AGO2', cellLine: 'HEK293S', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-AGO2_LCL-BAC', symbol: 'AGO2', name: 'AGO2', cellLine: 'LCL-BAC', diseaseState: 'Infected with EBV', species: 'Human' }, { id: 'clipdb-AGO2_EF3D-AGO2', symbol: 'AGO2', name: 'AGO2', cellLine: 'EF3D-AGO2', diseaseState: 'Infected with EBV', species: 'Human' }, { id: 'clipdb-AGO2_LCL-BAC-D2', symbol: 'AGO2', name: 'AGO2', cellLine: 'LCL-BAC-D2', diseaseState: 'Infected with EBV', species: 'Human' }, { id: 'clipdb-AGO3_HEK293', symbol: 'AGO3', name: 'AGO3', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-AGO4_HEK293', symbol: 'AGO4', name: 'AGO4', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-ALKBH5_HEK293', symbol: 'ALKBH5', name: 'ALKBH5', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-AUH_HepG2', symbol: 'AUH', name: 'AUH', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-AUH_K562', symbol: 'AUH', name: 'AUH', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-BCCIP_HepG2', symbol: 'BCCIP', name: 'BCCIP', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'clipdb-C17orf85_HEK293', symbol: 'C17orf85', name: 'C17orf85', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-CAPRIN1_HEK293', symbol: 'CAPRIN1', name: 'CAPRIN1', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-CPSF1_HEK293', symbol: 'CPSF1', name: 'CPSF1', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-CPSF2_HEK293', symbol: 'CPSF2', name: 'CPSF2', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-CPSF3_HEK293', symbol: 'CPSF3', name: 'CPSF3', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-CPSF4_HEK293', symbol: 'CPSF4', name: 'CPSF4', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-CPSF6_HEK293', symbol: 'CPSF6', name: 'CPSF6', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-CPSF6_K562', symbol: 'CPSF6', name: 'CPSF6', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-CPSF7_HEK293', symbol: 'CPSF7', name: 'CPSF7', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-CSTF2_HEK293', symbol: 'CSTF2', name: 'CSTF2', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-CSTF2_HeLa', symbol: 'CSTF2', name: 'CSTF2', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'clipdb-CSTF2T_HEK293', symbol: 'CSTF2T', name: 'CSTF2T', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-CSTF2T_HepG2', symbol: 'CSTF2T', name: 'CSTF2T', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-CSTF2T_K562', symbol: 'CSTF2T', name: 'CSTF2T', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-DDX3X_K562', symbol: 'DDX3X', name: 'DDX3X', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-DDX42_K562', symbol: 'DDX42', name: 'DDX42', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-DGCR8_HEK293T', symbol: 'DGCR8', name: 'DGCR8', cellLine: 'HEK293T', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-DGCR8_K562', symbol: 'DGCR8', name: 'DGCR8', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-EIF4A3_HeLa', symbol: 'EIF4A3', name: 'EIF4A3', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'encode-EIF4G1_K562', symbol: 'EIF4G1', name: 'EIF4G1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-EIF4G2_K562', symbol: 'EIF4G2', name: 'EIF4G2', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-ELAVL1_HEK293', symbol: 'ELAVL1', name: 'ELAVL1', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-ELAVL1_HeLa', symbol: 'ELAVL1', name: 'ELAVL1', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'clipdb-EZH2_HCT116', symbol: 'EZH2', name: 'EZH2', cellLine: 'HCT116', diseaseState: 'Colorectal adenocarcinoma', species: 'Human' }, { id: 'encode-FAM120A_K562', symbol: 'FAM120A', name: 'FAM120A', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-FAM120A_HepG2', symbol: 'FAM120A', name: 'FAM120A', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'clipdb-FBL_HEK293', symbol: 'FBL', name: 'FBL', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-FIP1L1_HEK293', symbol: 'FIP1L1', name: 'FIP1L1', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-FKBP4_HepG2', symbol: 'FKBP4', name: 'FKBP4', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'clipdb-FMR1_HEK293', symbol: 'FMR1', name: 'FMR1', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-FMR1_K562', symbol: 'FMR1', name: 'FMR1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-FUS_K562', symbol: 'FUS', name: 'FUS', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-FXR1_HEK293', symbol: 'FXR1', name: 'FXR1', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-FXR1_K562', symbol: 'FXR1', name: 'FXR1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-FXR2_HEK293', symbol: 'FXR2', name: 'FXR2', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-FXR2_K562', symbol: 'FXR2', name: 'FXR2', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-GNL3_K562', symbol: 'GNL3', name: 'GNL3', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-GTF2F1_HepG2', symbol: 'GTF2F1', name: 'GTF2F1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-GTF2F1_K562', symbol: 'GTF2F1', name: 'GTF2F1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-HNRNPA1_HEK293T', symbol: 'HNRNPA1', name: 'HNRNPA1', cellLine: 'HEK293T', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-HNRNPA1_HepG2', symbol: 'HNRNPA1', name: 'HNRNPA1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-HNRNPA1_K562', symbol: 'HNRNPA1', name: 'HNRNPA1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-HNRNPA2B1_HEK293T', symbol: 'HNRNPA2B1', name: 'HNRNPA2B1', cellLine: 'HEK293T', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-HNRNPC_HeLa', symbol: 'HNRNPC', name: 'HNRNPC', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'encode-HNRNPC_HepG2', symbol: 'HNRNPC', name: 'HNRNPC', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'clipdb-HNRNPF_HEK293T', symbol: 'HNRNPF', name: 'HNRNPF', cellLine: 'HEK293T', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-HNRNPH_HEK293T', symbol: 'HNRNPH', name: 'HNRNPH', cellLine: 'HEK293T', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-HNRNPK_HepG2', symbol: 'HNRNPK', name: 'HNRNPK', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-HNRNPK_K562', symbol: 'HNRNPK', name: 'HNRNPK', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-HNRNPM_HEK293T', symbol: 'HNRNPM', name: 'HNRNPM', cellLine: 'HEK293T', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-HNRNPM_K562', symbol: 'HNRNPM', name: 'HNRNPM', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-HNRNPM_HepG2', symbol: 'HNRNPM', name: 'HNRNPM', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'clipdb-HNRNPU_HEK293T', symbol: 'HNRNPU', name: 'HNRNPU', cellLine: 'HEK293T', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-HNRNPU_HeLa', symbol: 'HNRNPU', name: 'HNRNPU', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'encode-HNRNPU_HepG2', symbol: 'HNRNPU', name: 'HNRNPU', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-HNRNPU_K562', symbol: 'HNRNPU', name: 'HNRNPU', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-HNRNPUL1_HepG2', symbol: 'HNRNPUL1', name: 'HNRNPUL1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-HNRNPUL1_K562', symbol: 'HNRNPUL1', name: 'HNRNPUL1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-IGF2BP1_HEK293', symbol: 'IGF2BP1', name: 'IGF2BP1', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-IGF2BP1_HepG2', symbol: 'IGF2BP1', name: 'IGF2BP1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-IGF2BP1_K562', symbol: 'IGF2BP1', name: 'IGF2BP1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-IGF2BP2_HEK293', symbol: 'IGF2BP2', name: 'IGF2BP2', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-IGF2BP2_K562', symbol: 'IGF2BP2', name: 'IGF2BP2', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-IGF2BP3_HEK293', symbol: 'IGF2BP3', name: 'IGF2BP3', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-IGF2BP3_K562', symbol: 'IGF2BP3', name: 'IGF2BP3', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-IGF2BP3_HepG2', symbol: 'IGF2BP3', name: 'IGF2BP3', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-ILF3_K562', symbol: 'ILF3', name: 'ILF3', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-KHDRBS1_K562', symbol: 'KHDRBS1', name: 'KHDRBS1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-KHSRP_K562', symbol: 'KHSRP', name: 'KHSRP', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-LARP7_HepG2', symbol: 'LARP7', name: 'LARP7', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-LARP7_K562', symbol: 'LARP7', name: 'LARP7', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-LIN28A_HEK293', symbol: 'LIN28A', name: 'LIN28A', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-LIN28A_H9', symbol: 'LIN28A', name: 'LIN28A', cellLine: 'H9', diseaseState: 'Normal', species: 'Human' }, { id: 'clipdb-LIN28B_HEK293', symbol: 'LIN28B', name: 'LIN28B', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-LIN28B_HepG2', symbol: 'LIN28B', name: 'LIN28B', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-LIN28B_K562', symbol: 'LIN28B', name: 'LIN28B', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-LSM11_K562', symbol: 'LSM11', name: 'LSM11', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-MOV10_HEK293', symbol: 'MOV10', name: 'MOV10', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-NONO_K562', symbol: 'NONO', name: 'NONO', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-NOP56_HEK293', symbol: 'NOP56', name: 'NOP56', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-NOP58_HEK293', symbol: 'NOP58', name: 'NOP58', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-NPM1_K562', symbol: 'NPM1', name: 'NPM1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-NUDT21_HEK293', symbol: 'NUDT21', name: 'NUDT21', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-PCBP2_HepG2', symbol: 'PCBP2', name: 'PCBP2', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-PRPF8_K562', symbol: 'PRPF8', name: 'PRPF8', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-PRPF8_HepG2', symbol: 'PRPF8', name: 'PRPF8', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-PTBP1_K562', symbol: 'PTBP1', name: 'PTBP1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-PTBP1PTBP2_HeLa', symbol: 'PTBP1PTBP2', name: 'PTBP1PTBP2', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'clipdb-PUM2_HEK293', symbol: 'PUM2', name: 'PUM2', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-QKI_HEK293', symbol: 'QKI', name: 'QKI', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-RBFOX2_HepG2', symbol: 'RBFOX2', name: 'RBFOX2', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-RBM22_K562', symbol: 'RBM22', name: 'RBM22', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-RBM27_K562', symbol: 'RBM27', name: 'RBM27', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-RTCB_HEK293', symbol: 'RTCB', name: 'RTCB', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-SAFB2_K562', symbol: 'SAFB2', name: 'SAFB2', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-SBDS_K562', symbol: 'SBDS', name: 'SBDS', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-SF3A3_HepG2', symbol: 'SF3A3', name: 'SF3A3', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-SF3B4_HepG2', symbol: 'SF3B4', name: 'SF3B4', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-SLBP_K562', symbol: 'SLBP', name: 'SLBP', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-SLTM_HepG2', symbol: 'SLTM', name: 'SLTM', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-SLTM_K562', symbol: 'SLTM', name: 'SLTM', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-SMNDC1_K562', symbol: 'SMNDC1', name: 'SMNDC1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-SMNDC1_HepG2', symbol: 'SMNDC1', name: 'SMNDC1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-SND1_HepG2', symbol: 'SND1', name: 'SND1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-SND1_K562', symbol: 'SND1', name: 'SND1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-SRSF1_K562', symbol: 'SRSF1', name: 'SRSF1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-SRSF1_HepG2', symbol: 'SRSF1', name: 'SRSF1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-SRSF7_HepG2', symbol: 'SRSF7', name: 'SRSF7', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-SRSF9_HepG2', symbol: 'SRSF9', name: 'SRSF9', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-TAF15_K562', symbol: 'TAF15', name: 'TAF15', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-TAF15_HepG2', symbol: 'TAF15', name: 'TAF15', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'clipdb-TARDBP_H9', symbol: 'TARDBP', name: 'TARDBP', cellLine: 'H9', diseaseState: 'Normal', species: 'Human' }, { id: 'clipdb-TARDBP_SH-SY5Y', symbol: 'TARDBP', name: 'TARDBP', cellLine: 'SH-SY5Y', diseaseState: 'Metastatic neuroblastoma', species: 'Human' }, { id: 'encode-TARDBP_K562', symbol: 'TARDBP', name: 'TARDBP', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-TIA1_HeLa', symbol: 'TIA1', name: 'TIA1', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'encode-TIA1_HepG2', symbol: 'TIA1', name: 'TIA1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'clipdb-TIAL1_HeLa', symbol: 'TIAL1', name: 'TIAL1', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'encode-TIAL1_K562', symbol: 'TIAL1', name: 'TIAL1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-TNRC6A_HEK293', symbol: 'TNRC6A', name: 'TNRC6A', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-TNRC6A_K562', symbol: 'TNRC6A', name: 'TNRC6A', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-TNRC6B_HEK293', symbol: 'TNRC6B', name: 'TNRC6B', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'clipdb-TNRC6C_HEK293', symbol: 'TNRC6C', name: 'TNRC6C', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }, { id: 'encode-TRA2A_K562', symbol: 'TRA2A', name: 'TRA2A', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-TRA2A_HepG2', symbol: 'TRA2A', name: 'TRA2A', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-TROVE2_K562', symbol: 'TROVE2', name: 'TROVE2', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-U2AF1_K562', symbol: 'U2AF1', name: 'U2AF1', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-U2AF1_HepG2', symbol: 'U2AF1', name: 'U2AF1', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-U2AF2_K562', symbol: 'U2AF2', name: 'U2AF2', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'encode-U2AF2_HepG2', symbol: 'U2AF2', name: 'U2AF2', cellLine: 'HepG2', diseaseState: 'Hepatocellular carcinoma', species: 'Human' }, { id: 'encode-XRN2_K562', symbol: 'XRN2', name: 'XRN2', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-YTHDF2_HeLa', symbol: 'YTHDF2', name: 'YTHDF2', cellLine: 'HeLa', diseaseState: 'Cervical adenocarcinoma', species: 'Human' }, { id: 'encode-YWHAG_K562', symbol: 'YWHAG', name: 'YWHAG', cellLine: 'K562', diseaseState: 'Chronic myelogenous leukemia (CML)', species: 'Human' }, { id: 'clipdb-ZC3H7B_HEK293', symbol: 'ZC3H7B', name: 'ZC3H7B', cellLine: 'HEK293', diseaseState: 'Cancer', species: 'Human' }];

ReactDOM.render(React.createElement(SetenApp, {
    collections: collections,
    samples: samples,
    explore: explore
}), document.querySelector('.container-app'));