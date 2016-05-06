import React from 'react';
import PanelAnalyzeParametersEnrichmentMethods from './panel-analyze-parameters-enrichment-methods';
import PanelAnalyzeParametersScoringMethods from './panel-analyze-parameters-scoring-methods';
import PanelAnalyzeParametersCorrectionMethods from './panel-analyze-parameters-correction-methods';
import PanelAnalyzeParametersGeneSetCutoff from './panel-analyze-parameters-gene-set-cutoff';
import PanelAnalyzeParametersOverlapCutoff from './panel-analyze-parameters-overlap-cutoff';
import PanelAnalyzeParametersSignificanceCutoff from './panel-analyze-parameters-significance-cutoff';
import PanelAnalyzeParametersNumberOfIterations from './panel-analyze-parameters-number-of-iterations';


var PanelAnalyzeParameters = React.createClass({
  render: function() {
    var parameters;

    if (this.props.configure) {
      parameters = (
        <div>
          <div className="form-group clearfix">

            <PanelAnalyzeParametersEnrichmentMethods
              enrichmentMethods = {this.props.enrichmentMethods}
              inputEnrichmentMethod = {this.props.inputEnrichmentMethod}
              disabled = {this.props.disabled}
              onSelectEnrichmentMethodChange = {this.props.onSelectEnrichmentMethodChange}
              />
            <PanelAnalyzeParametersScoringMethods
              scoringMethods = {this.props.scoringMethods}
              inputEnrichmentMethod = {this.props.inputEnrichmentMethod}
              inputScoringMethod = {this.props.inputScoringMethod}
              disabled = {this.props.disabled}
              onSelectScoringMethodChange = {this.props.onSelectScoringMethodChange}
              />
            <PanelAnalyzeParametersCorrectionMethods
              correctionMethods = {this.props.correctionMethods}
              inputEnrichmentMethod = {this.props.inputEnrichmentMethod}
              inputCorrectionMethod = {this.props.inputCorrectionMethod}
              disabled = {this.props.disabled}
              onSelectCorrectionMethodChange = {this.props.onSelectCorrectionMethodChange}
              />

          </div>

          <div className="form-group clearfix">

            <PanelAnalyzeParametersGeneSetCutoff
              inputGeneSetCutoff = {this.props.inputGeneSetCutoff}
              disabled = {this.props.disabled}
              onGeneSetCutoffChange = {this.props.onGeneSetCutoffChange}
              />
            <PanelAnalyzeParametersOverlapCutoff
              inputOverlapCutoff = {this.props.inputOverlapCutoff}
              disabled = {this.props.disabled}
              onOverlapCutoffChange = {this.props.onOverlapCutoffChange}
              />
            <PanelAnalyzeParametersSignificanceCutoff
              inputEnrichmentMethod = {this.props.inputEnrichmentMethod}
              inputSignificanceCutoff = {this.props.inputSignificanceCutoff}
              disabled = {this.props.disabled}
              onSignificanceCutoffChange = {this.props.onSignificanceCutoffChange}
              />
            <PanelAnalyzeParametersNumberOfIterations
              inputEnrichmentMethod = {this.props.inputEnrichmentMethod}
              inputNumberOfIterations = {this.props.inputNumberOfIterations}
              disabled = {this.props.disabled}
              onNumberOfIterationsChange = {this.props.onNumberOfIterationsChange}
              />

          </div>
        </div>
      );
    }


    return (
      <div>
        <div className="form-group clearfix">
          <div className="col-md-12">
            <button
              className="btn btn-link btn-sm pull-right"
              onClick={this.props.onClickToggleParameters}>
              <i className="fa fa-cog"></i>
              <span>&nbsp;Toggle advanced parameters</span>
            </button>
          </div>
        </div>
        { parameters }
      </div>
    );
  }
});

export default PanelAnalyzeParameters;
