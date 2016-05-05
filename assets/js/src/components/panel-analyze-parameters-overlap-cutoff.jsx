import React from 'react';

var PanelAnalyzeParametersOverlapCutoff = React.createClass({

  render: function() {
    return (
      <div className="col-md-3 col-sm-3">
        <label>
          <span>
            <abbr title="Minimum number of overlapping genes between the dataset and each gene set">
              Overl. cutoff
            </abbr>
          </span>
          <a
            className="btn btn-link btn-xs"
            href="docs.html#inputs-overlap-cutoff"
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
          defaultValue={this.props.inputOverlapCutoff}
          min="1"
          step="1"
          placeholder="Overl. cutoff"
          disabled={this.props.disabled}
          onChange={this.props.onOverlapCutoffChange}
          />
      </div>
    );
  }

});

export default PanelAnalyzeParametersOverlapCutoff;
