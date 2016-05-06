import React from 'react';

var ResultGroupProgressBar = React.createClass({
  render: function() {
    var progress = null;

    if (this.props.progress !== null) {
      var barStyle = {
        minWidth: "2em",
        width: this.props.progress + "%"
      };

      progress = (
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
    }

    return (
      <div>
        { progress }
      </div>
    );
  }
});

export default ResultGroupProgressBar;
