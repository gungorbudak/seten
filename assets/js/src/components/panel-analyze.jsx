import React from 'react';
import PanelAnalyzeFile from './panel-analyze-file';
import PanelAnalyzeCollections from './panel-analyze-collections';
import PanelAnalyzeParameters from './panel-analyze-parameters';

var PanelAnalyze = React.createClass({
  render: function() {
    var button;

    if (!this.props.disabled) {
      button = (
        <button
          className="btn btn-primary btn-sm"
          disabled={this.props.disabled}
          onClick={this.props.onInputSubmitClick}
          >
          <i className="fa fa-send">
          </i>
          <span>&nbsp;Submit</span>
        </button>
      );
    } else {
      button = (
        <button
          className="btn btn-danger btn-sm"
          disabled={!this.props.disabled}
          onClick={this.props.onInputCancelClick}
          >
          <i className="fa fa-times-circle">
          </i>
          <span>&nbsp;Cancel</span>
        </button>
      );
    }

    return (
      <div className="panel panel-info panel-analyze">

        <div className="panel-heading">
          <h3 className="panel-title">
            <i className="fa fa-flask">
            </i>
            <span>&nbsp;Analyze</span>
          </h3>
        </div>

        <div className="panel-body panel-body-analyze">
          <div className="form-horizontal">
            <PanelAnalyzeFile
              samples={this.props.samples}
              disabled={this.props.disabled}
              inputFileName={this.props.inputFileName}
              onInputSampleFileClick={this.props.onInputSampleFileClick}
              onChange={this.props.onInputFileChange}
              />
            <PanelAnalyzeCollections
              inputOrganism={this.props.inputOrganism}
              inputCollections={this.props.inputCollections}
              organisms={this.props.organisms}
              collections={this.props.collections}
              disabled={this.props.disabled}
              onSelectOrganismChange={this.props.onSelectOrganismChange}
              onSelectCollectionsChange={this.props.onSelectCollectionsChange}
              />
            <PanelAnalyzeParameters
              enrichmentMethods={this.props.enrichmentMethods}
              scoringMethods={this.props.scoringMethods}
              correctionMethods={this.props.correctionMethods}
              inputEnrichmentMethod={this.props.inputEnrichmentMethod}
              inputScoringMethod={this.props.inputScoringMethod}
              inputCorrectionMethod={this.props.inputCorrectionMethod}
              inputGeneSetCutoff={this.props.inputGeneSetCutoff}
              inputOverlapCutoff={this.props.inputOverlapCutoff}
              inputSignificanceCutoff={this.props.inputSignificanceCutoff}
              inputNumberOfIterations={this.props.inputNumberOfIterations}
              visible={this.props.areParametersVisible}
              disabled={this.props.disabled}
              onClickToggleParameters={this.props.onClickToggleParameters}
              onSelectEnrichmentMethodChange={this.props.onSelectEnrichmentMethodChange}
              onSelectScoringMethodChange={this.props.onSelectScoringMethodChange}
              onSelectCorrectionMethodChange={this.props.onSelectCorrectionMethodChange}
              onGeneSetCutoffChange={this.props.onGeneSetCutoffChange}
              onOverlapCutoffChange={this.props.onOverlapCutoffChange}
              onSignificanceCutoffChange={this.props.onSignificanceCutoffChange}
              onNumberOfIterationsChange={this.props.onNumberOfIterationsChange}
              />
            <div className="text-right">
              {button}
            </div>
          </div>
        </div>

      </div>
    );
  }
});

export default PanelAnalyze;
