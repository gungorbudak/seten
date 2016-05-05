import React from 'react';
import ResultCollectionTableHeaderSortIcon from './result-collection-table-header-sort-icon';

var ResultCollectionTableHeader = React.createClass({
  render: function() {
    var component = this;
    var sort = component.props.sort;
    var items;
    var direction;

    items = component.props.columns.map(function(column, i) {
      if (column.id == sort.id) {
        direction = sort.direction;
      } else {
        direction = null;
      }
      return (
        <th
          id={column.id}
          key={'item' + i}
          className="sortable"
          onClick={component.props.onSortClick}
          >
          {column.name}
          <ResultCollectionTableHeaderSortIcon direction={direction} />
        </th>
      );
    });

    return (
      <thead>
        <tr>
          { items }
        </tr>
      </thead>
    );
  }
});

export default ResultCollectionTableHeader;
