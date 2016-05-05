import React from 'react';
import ResultGroupCompareCollections from './result-group-compare-collections';

var ResultGroupTitle = React.createClass({
  render: function() {
    var title = (this.props.compare) ? 'Compare': 'View';
    var toggle = (this.props.compare) ? 'toggle-on': 'toggle-off';
    var compareCollections;
    var compareExport;

    if (this.props.compare) {
      compareCollections = (
        <li>
          <ResultGroupCompareCollections
            collections={this.props.collections}
            inputCollectionsCompared={this.props.inputCollectionsCompared}
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
            <i className="fa fa-external-link fa-fw">
            </i>
            <span className="hidden-xs">&nbsp;Export</span>
          </button>
        </li>
      );
    }

    return (
      <div className="row flex-align">
        <div className="col-xs-3 flex-align-bottom">
          <h2>
            { title }
          </h2>
        </div>
        <div className="col-xs-9 text-right flex-align-bottom">
          <ul className="list-inline list-inline-buttons">
            { compareCollections }
            { compareExport }
            <li>
              <button
                className="btn btn-default btn-xs"
                title="Clear results"
                onClick={this.props.onResultsClearClick}>
                <i className="fa fa-trash fa-fw">
                </i>
                <span className="hidden-xs">&nbsp;Clear</span>
              </button>
            </li>
            <li>
              <button
                className="btn btn-default btn-xs"
                title="Toggle view/compare"
                onClick={this.props.onResultsCompareClick}>
                <i className={"fa fa-" + toggle + " fa-fw"}>
                </i>
                <span className="hidden-xs">&nbsp;Compare</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

export default ResultGroupTitle;
