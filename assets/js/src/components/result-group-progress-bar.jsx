import React from 'react';

var ResultGroupProgressBar = React.createClass({
  render: function() {
    if (this.props.show && this.props.progress !== undefined) {
      var barStyle = {
        minWidth: "2em",
        width: this.props.progress + "%"
      };

      return (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped active"
            role="progressbar"
            aria-valuenow={this.props.progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={barStyle}
            >
            {this.props.progress + "%"}
          </div>
        </div>
      );
    } else {
      return (
        <div>
        </div>
      );
    }
  }
});

export default ResultGroupProgressBar;
