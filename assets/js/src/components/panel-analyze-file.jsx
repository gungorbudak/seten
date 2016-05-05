import React from 'react';
import ReactDOM from 'react-dom';

var PanelAnalyzeFile = React.createClass({
  componentDidMount: function(argument) {
    var $item = $(ReactDOM.findDOMNode(this));

    $item.find('a#information').popover({
      container: '.container-app',
      placement: 'auto',
      html: true
    });
  },
  render: function () {
    var component = this;
    return (
      <div className="form-group">
        <label className="col-md-2 control-label" style={ {textAlign: "left"} }>
          <span>
            File
          </span>
          <a
            className="btn btn-link btn-xs"
            href="docs.html#inputs-file"
            title="View the help section on Docs"
            target="_blank"
            >
            <i className="fa fa-question-circle">
            </i>
          </a>
        </label>
        <div className="col-md-10">
          <div className="input-group input-group-sm">
            <span className="input-group-btn">
              <span
                className="btn btn-default btn-file"
                disabled={component.props.disabled}>
                Browse&hellip;
                <input
                  type="file"
                  name="file"
                  title="Select an input file"
                  onChange={component.props.onChange}
                  />
              </span>
            </span>
            <input
              type="text"
              className="form-control"
              disabled={component.props.disabled}
              value={component.props.inputFileName}
              readOnly={true}
              />
          </div>
          <p className="help-block">
            <span className="hidden-xs hidden-sm">Sample datasets</span>
            { component.props.samples.map(function(item, i) {
              item.name = item.symbol + ' / ' + item.cellLine;
              var itemSummary = [
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
                <span key={'item' + i}>
                  <button
                    className="btn btn-link btn-xs"
                    id={item.id}
                    title={'Load the sample dataset ' + item.name + ' (' + item.species + ')'}
                    disabled={component.props.disabled}
                    onClick={component.props.onInputSampleFileClick}
                    >
                    {item.symbol} ({ item.species })
                  </button>
                  <a
                    id="information"
                    className="btn btn-link btn-xs"
                    tabIndex="0"
                    role="button"
                    title={item.name}
                    data-original-title={item.name}
                    data-content={itemSummary}
                    data-trigger="focus"
                    >
                    <i className="fa fa-info-circle">
                    </i>
                  </a>
                </span>
              );
            }) }
          </p>
        </div>
      </div>
    );
  }
});

export default PanelAnalyzeFile;
