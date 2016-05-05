import React from 'react';

var PanelAnalyzeParametersEnrichmentMethods = React.createClass({

  render: function() {
    var component = this;

    return (
      <div className="col-md-4 col-sm-4">
        <label>
          <span>
            <abbr title="The method for enrichment analysis">
              Enr. method
            </abbr>
          </span>
          <a
            className="btn btn-link btn-xs"
            href="docs.html#inputs-enrichment-method"
            title="View the help section on Docs"
            target="_blank"
            >
            <i className="fa fa-question-circle">
            </i>
          </a>
        </label>
        <select
          className="form-control input-sm"
          disabled={component.props.disabled}
          defaultValue={component.props.inputEnrichmentMethod}
          onChange={component.props.onSelectEnrichmentMethodChange}>

          { component.props.enrichmentMethods.map(function (option, i) {
            return (
              <option
                key={'item' + i}
                value={option.id}
                defaultValue={option.id == component.props.inputEnrichmentMethod}>
                { option.name }
              </option>
            );
          }) }

        </select>
      </div>
    );
  }

});

export default PanelAnalyzeParametersEnrichmentMethods;
