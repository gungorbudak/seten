import React from 'react';
import ReactDOM from 'react-dom';

var PanelAnalyzeCollections = React.createClass({
  componentDidMount: function() {
      var $node = $(ReactDOM.findDOMNode(this));

      $node.find('select#organism').multiselect({
          buttonClass: 'btn btn-default btn-sm btn-block',
          buttonContainer: '<div class="btn-group" style="display: block;"></div>',
          numberDisplayed: 1,
          onChange: this.handleOrganismChange,
          maxHeight: 120
      });

      $node.find('select#collections').multiselect({
          buttonClass: 'btn btn-default btn-sm btn-block',
          buttonContainer: '<div class="btn-group" style="display: block;"></div>',
          numberDisplayed: 1,
          onChange: this.props.onSelectCollectionsChange,
          maxHeight: 120,
          dropRight: true
      });
  },
  componentDidUpdate: function() {
    var $node = $(ReactDOM.findDOMNode(this));

    $node.find('select#organism').multiselect('rebuild');
    $node.find('select#collections').multiselect('rebuild');

    if (this.props.disabled) {
      $node.find('select#organism').multiselect('disable');
      $node.find('select#collections').multiselect('disable');
    }
  },
  handleOrganismChange: function (e) {
    var $node = $(ReactDOM.findDOMNode(this));
    // deselect all previously selected options when the organism changes
    $node.find('select#collections').multiselect('deselectAll', false);
    // continue with handling organism change in the state
    this.props.onSelectOrganismChange(e);
  },
  render: function () {
    var component = this;

    var organismsOptions = component.props.organisms.map(function (option, i) {
      return (
        <option
          key={'item' + i}
          value={option.id}
          defaultValue={option.id == component.props.inputOrganism}>
          { option.organism + ' ' + option.build }
        </option>
      );
    });

    var collectionsFiltered = component.props.collections.filter(function (option) {
      return option.organisms.indexOf(component.props.inputOrganism) > -1;
    });

    // get selected collections
    var collectionsSelected = collectionsFiltered.filter(function(option) {
        return component.props.inputCollections.indexOf(option.id) > -1;
    }).map(function(option) {
        return option.id;
    });

    var collectionsOptions = collectionsFiltered.map(function (option, i) {
      return (
        <option
          key={'item' + i}
          value={option.id}
          defaultValue={option.selected}>
          {option.name}
        </option>
      );
    });

    return (
      <div className="form-group">
        <div className="col-md-6 col-sm-6 col-xs-6">
          <label>
            <span>
              Organism
            </span>
            <a
              className="btn btn-link btn-xs"
              href="docs.html#inputs-organism"
              title="View the help section on Docs"
              target="_blank"
              >
              <i className="fa fa-question-circle">
              </i>
            </a>
          </label>
          <select
            id="organism"
            className="form-control"
            disabled={component.props.disabled}
            defaultValue={component.props.inputOrganism}
            onChange={component.props.onSelectOrganismChange}>

            { organismsOptions }

          </select>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-6">
          <label>
            <span>
              G. set collections
            </span>
            <a
              className="btn btn-link btn-xs"
              href="docs.html#inputs-gene-set-collections"
              title="View the help section on Docs"
              target="_blank"
              >
              <i className="fa fa-question-circle">
              </i>
            </a>
          </label>
          <select
            id="collections"
            className="form-control"
            multiple="multiple"
            defaultValue={collectionsSelected}
            disabled={component.props.disabled}
            onChange={component.props.onSelectCollectionsChange}>

            { collectionsOptions }

          </select>
        </div>
      </div>
    );
  }
});

export default PanelAnalyzeCollections;
