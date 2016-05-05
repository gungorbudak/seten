import React from 'react';

var PanelAnalyzeParametersCorrectionMethods = React.createClass({

  render: function() {
    var component = this;
    var disabled = component.props.disabled;
    if (component.props.inputEnrichmentMethod === 'gse') {
      disabled = true;
    }

    return (
      <div className="col-md-4 col-sm-4">
        <label>
          <span>
            <abbr title="The method to correct for p-values obtained from functional enrichment analysis">
              Corr. method
            </abbr>
          </span>
          <a
            className="btn btn-link btn-xs"
            href="docs.html#inputs-correction-method"
            title="View the help section on Docs"
            target="_blank"
            >
            <i className="fa fa-question-circle">
            </i>
          </a>
        </label>
        <select
          className="form-control input-sm"
          disabled={disabled}
          defaultValue={component.props.inputCorrectionMethod}
          onChange={component.props.onSelectCorrectionMethodChange}>

          { component.props.correctionMethods.map(function (option, i) {
            return (
              <option
                key={'item' + i}
                value={option.id}
                defaultValue={option.id == component.props.inputCorrectionMethod}>
                { option.name }
              </option>
            );
          }) }

        </select>
      </div>
    );
  }

});

export default PanelAnalyzeParametersCorrectionMethods;
