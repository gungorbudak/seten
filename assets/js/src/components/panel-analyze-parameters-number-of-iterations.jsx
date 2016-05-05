import React from 'react';

var PanelAnalyzeParametersNumberOfIterations = React.createClass({

  render: function() {
    var disabled = this.props.disabled;
    if (this.props.inputEnrichmentMethod === 'fe') {
      disabled = true;
    }

    return (
      <div className="col-md-3 col-sm-3">
        <label>
          <span>
            <abbr title="Number of iterations for gene set enrichment analysis">
              Num. of iters.
            </abbr>
          </span>
          <a
            className="btn btn-link btn-xs"
            href="docs.html#inputs-number-of-iterations"
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
          defaultValue={this.props.inputNumberOfIterations}
          min="1000"
          step="1"
          placeholder="Number of iters."
          disabled={disabled}
          onChange={this.props.onNumberOfIterationsChange}
          />
      </div>
    );
  }

});

export default PanelAnalyzeParametersNumberOfIterations;
