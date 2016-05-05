import React from 'react';

var PanelAnalyzeParametersScoringMethods = React.createClass({

  render: function() {
    var component = this;
    var disabled = component.props.disabled;
    if (component.props.inputEnrichmentMethod === 'fe') {
      disabled = true;
    }

    return (
      <div className="col-md-4 col-sm-4">
        <label>
          <span>
            <abbr title="The method to compute a gene level score from multiple binding scores for the same gene">
              Scor. method
            </abbr>
          </span>
          <a
            className="btn btn-link btn-xs"
            href="docs.html#inputs-scoring-method"
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
          defaultValue={component.props.inputScoringMethod}
          onChange={component.props.onSelectScoringMethodChange}>

          { component.props.scoringMethods.map(function (option, i) {
            return (
              <option
                key={'item' + i}
                value={option.id}
                defaultValue={option.id == component.props.inputScoringMethod}>
                { option.name }
              </option>
            );
          }) }

        </select>
      </div>
    );
  }

});

export default PanelAnalyzeParametersScoringMethods;
