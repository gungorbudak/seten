import React from 'react';
import ResultCollectionTableBodyRow from './result-collection-table-body-row';

var ResultCollectionTableBody = React.createClass({
  render: function() {
    var component = this;
    var rows = component.props.data.map(function(row, i) {
      return (
        <ResultCollectionTableBodyRow
          key={'item' + i}
          row={row}
          shownPValue={component.props.shownPValue}
          enrichmentMethod={component.props.enrichmentMethod}
          onGenesClick={component.props.onGenesClick}
          />
      );
    });

    return (
      <tbody>
        { rows }
      </tbody>
    );
  }
});

export default ResultCollectionTableBody;
