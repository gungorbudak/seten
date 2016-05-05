import React from 'react';
import ReactDOM from 'react-dom';
import * as _ from 'lodash';

var ResultGroupCompareCollections = React.createClass({
  componentDidMount: function() {
    var $node = $(ReactDOM.findDOMNode(this));

    $node.find('select').multiselect({
      buttonClass: 'btn btn-default btn-xs',
      includeSelectAllOption: true,
      numberDisplayed: 1,
      onChange: this.props.onCompareCollectionsChange,
      onSelectAll: this.props.onCompareCollectionsChange
    });
  },
  render: function() {
    var component = this;
    var options;

    // get all available options
    options = component.props.collections.map(function (option, i) {
      return (
        <option
          key={'item' + i}
          value={option.id}
          defaultValue={_.indexOf(component.props.inputCollectionsCompared, option.id) !== -1}>
          {option.name}
        </option>
      );
    });

    return (
      <div>
        <label
          className="hidden-xs hidden-sm text-muted"
          style={ {marginBottom: '0px'} }>
          Collections&nbsp;
        </label>
        <select
          className="form-control"
          multiple="multiple"
          defaultValue={component.props.inputCollectionsCompared}>
          { options }
        </select>
      </div>
    );
  }
});

export default ResultGroupCompareCollections;
