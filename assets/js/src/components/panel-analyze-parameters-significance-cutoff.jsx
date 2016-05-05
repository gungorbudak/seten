import React from 'react';

var PanelAnalyzeParametersSignificanceCutoff = React.createClass({

  render: function() {
    var disabled = this.props.disabled;
    if (this.props.inputEnrichmentMethod === 'fe') {
      disabled = true;
    }

    return (
      <div className="col-md-3 col-sm-3">
        <label>
          <span>
            <abbr title="Cutoff for significant Mann-Whitney U test result">
              Sign. cutoff
            </abbr>
          </span>
          <a
            className="btn btn-link btn-xs"
            href="docs.html#inputs-significance-cutoff"
            title="View the help section on Docs"
            target="_blank"
            >
            <i className="fa fa-question-circle">
            </i>
          </a>
        </label>
        <input
          type="number"
          className="form-control input-sm"
          defaultValue={this.props.inputSignificanceCutoff}
          min="0"
          step="0.01"
          placeholder="Sign. cutoff"
          disabled={disabled}
          onChange={this.props.onSignificanceCutoffChange}
          />
      </div>
    );
  }

});

export default PanelAnalyzeParametersSignificanceCutoff;
