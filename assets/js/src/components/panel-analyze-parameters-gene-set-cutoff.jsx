import React from 'react';

var PanelAnalyzeParametersGeneSetCutoff = React.createClass({

  render: function() {
    var disabled = this.props.disabled;
    if (this.props.inputEnrichmentMethod === 'fe') {
      disabled = true;
    }

    return (
      <div className="col-md-3 col-sm-3">
        <label>
          <span>
            <abbr title="Maximum number of genes in gene sets in selected gene set collections">
              G. set cutoff
            </abbr>
          </span>
          <a
            className="btn btn-link btn-xs"
            href="docs.html#inputs-gene-set-cutoff"
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
          defaultValue={this.props.inputGeneSetCutoff}
          min="0"
          step="1"
          placeholder="G. set cutoff"
          disabled={disabled}
          onChange={this.props.onGeneSetCutoffChange}
          />
      </div>
    );
  }

});

export default PanelAnalyzeParametersGeneSetCutoff;
