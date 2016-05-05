import React from 'react';

var ResultSummary = React.createClass({
  render: function() {
    return (
      <div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>
                  Cell line
                </th>
                <th>Species</th>
                <th>
                  Disease state
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {this.props.summary.symbol}
                </td>
                <td>
                  {this.props.summary.cellLine}
                </td>
                <td>
                  {this.props.summary.species}
                </td>
                <td>
                  {this.props.summary.diseaseState}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

export default ResultSummary;
