import React from 'react';


var ResultTitle = React.createClass({
  render: function() {
    var enrichmentMethod;
    var switchShownPValue;
    var exportButton;

    if (this.props.enrichmentMethod == 'gse') {
      enrichmentMethod = (
       <span className="label label-success label-title">
         Gene set
       </span>
     );
    } else if (this.props.enrichmentMethod == 'fe') {
      enrichmentMethod = (
        <span className="label label-success label-title">
          Functional
        </span>
      );
    }

    if (this.props.isShownPValueSwitchable) {
      switchShownPValue = (
        <li>
          <div>
            <label
              className="hidden-xs hidden-sm text-muted"
              style={ {marginBottom: '0px'} }>
              Shown p-value&nbsp;
            </label>
            <div style={ {display: 'inline-block'} }>
              <select
                className="form-control input-xs"
                defaultValue={this.props.shownPValue}
                data-result-id={this.props.resultId}
                onChange={this.props.onShownPValueChange}>
                <option
                  value="fPValueCorr"
                  defaultValue={this.props.shownPValue == 'fPValueCorr'}>
                  Functional
                </option>
                <option
                  value="gSPValue"
                  defaultValue={this.props.shownPValue == 'gSPValue'}>
                  Gene set
                </option>
              </select>
            </div>
          </div>
        </li>
      );
    }

    if (this.props.isExportable) {
      exportButton = (
        <li>
          <button
            className="btn btn-default btn-xs"
            title="Export complete list of mapped genes and their scores as TSV"
            data-result-id={this.props.resultId}
            onClick={this.props.onExportGeneScoresClick}
            >
            <i className="fa fa-table">
            </i>
            <span className="hidden-xs">
              &nbsp;Export gene scores
            </span>
          </button>
        </li>
      );
    }

    return (
      <div className="row row-result-title flex-align">
        <div className="col-xs-6">
          <h3>
            { this.props.title }
            &nbsp;
            { enrichmentMethod }
          </h3>
        </div>
        <div className="col-xs-6 text-right flex-align-bottom">
          <ul className="list-inline list-inline-buttons">
            { switchShownPValue }
            { exportButton }
          </ul>
        </div>
      </div>
    );
  }
});


export default ResultTitle;
