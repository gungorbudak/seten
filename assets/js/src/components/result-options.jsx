import React from 'react';

var ResultOptions = React.createClass({
  render: function() {
    return (
      <div className="form-inline">
        <div className="form-group">
          <label className="text-muted">Options</label>
        </div>
        <div className="form-group">
          <label>
            Percent &gt;
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            className="form-control input-sm input-options"
            id={this.props.resultId}
            value={this.props.options.percent}
            onChange={this.props.onOptionsPercentChange}
            />
        </div>
        <div className="form-group">
          <label>
            <abbr title="Gene set p-value or corrected functional p-value">
              p-value
            </abbr> &lt;
          </label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            className="form-control input-sm input-options"
            id={this.props.resultId}
            value={this.props.options.pValue}
            onChange={this.props.onOptionsPValueChange}
            />
        </div>
      </div>
    );
  }
});

export default ResultOptions;
