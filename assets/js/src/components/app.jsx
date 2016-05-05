import React from 'react';
import { saveAs } from 'filesaver.js';
import * as _ from 'lodash';
import PanelExplore from './panel-explore';
import PanelAnalyze from './panel-analyze';
import ResultGroup from './result-group';
import ExploreWorker from 'worker?name=explore.worker.js!../workers/explore';
import SampleWorker from 'worker?name=sample.worker.js!../workers/sample';
import MappingWorker from 'worker?name=mapping.worker.js!../workers/mapping';
import CollectionWorker from 'worker?name=collection.worker.js!../workers/collection';
import EnrichmentWorker from 'worker?name=enrichment.worker.js!../workers/enrichment';

var App = React.createClass({
  getInitialState: function() {
    return {
      inputFile: undefined,
      inputFileName: '',
      inputOrganism: 'hsa_hg19',
      inputCollections: [],
      inputCollectionsCompared: [],
      inputEnrichmentMethod: 'gse',
      inputScoringMethod: 'max',
      inputCorrectionMethod: 'fdr',
      inputGeneSetCutoff: 350,
      inputOverlapCutoff: 5,
      inputSignificanceCutoff: 0.05,
      inputNumberOfIterations: 1000,
      inputErrors: [],
      workers: [],
      geneSetCollections: [],
      results: [],
      collections: this.props.collections,
      compare: false,
      result: undefined,
      isRunning: false,
      areParametersVisible: false
    };
  },
  statics: {
    getDefaultResultOptions: function() {
      return {
        percent: 5,
        pValue: 0.05
      };
    },
    getResultIdFromFileName: function(fileName) {
      return fileName.
        replace(/[^A-Za-z0-9]+/g, '').toLowerCase() +
        eval(parseInt(Math.random() * (9999 - 1000 + 1)) + 1000);
    }
  },
  resetSomeState: function() {
    // reset some state variables
    this.setState({workers: []});
    this.setState({geneCollections: []});
    this.setState({result: undefined});
  },
  togglePanelAnalyze: function(e) {
    this.setState({isRunning: !this.state.isRunning});
  },
  hideAdvancedParameters: function(e) {
    this.setState({areParametersVisible: false});
  },
  cancelAnalysis: function() {
    var workers = this.state.workers;
    var results = this.state.results;
    var result = this.state.result;
    var l = results.length;

    // terminate all available workers
    workers.forEach(function(worker) {
      worker.terminate();
    });

    // delete cancelled result from results
    while (l--) {
      if (results[l].id == result.id) {
        results.splice(l, 1);
        break;
      }
    }
    this.setState({results: results});

    // reset some state variables
    this.resetSomeState();
    // enable the panel back
    this.togglePanelAnalyze();
  },
  completeAnalysis: function() {
    var workers = this.state.workers;

    // terminate all available workers
    workers.forEach(function(worker) {
      worker.terminate();
    });
    // reset some state variables
    this.resetSomeState();
    // enable the panel back
    this.togglePanelAnalyze();
  },
  handleCompareCollectionsChange: function(e) {
    var selection = e;
    var collections = this.state.collections;
    var inputCollectionsCompared = this.state.inputCollectionsCompared;
    // select all is unchecked or
    // user unchecked all one by one
    if (selection === true) {
      inputCollectionsCompared = collections.map(function(collection) {
        return collection.id;
      });
    } else if (selection === false) {
      // select all is unchecked or
      // user unchecked all one by one
      inputCollectionsCompared = [];
    } else {
      // single option is checked or unchecked
      var collection = selection.get(0).value;
      if (_.indexOf(inputCollectionsCompared, collection) !== -1) {
        inputCollectionsCompared = _.pull(inputCollectionsCompared, collection);
      } else {
        inputCollectionsCompared.push(collection);
      }
    }
    // store it back in the state
    this.setState({inputCollectionsCompared: inputCollectionsCompared});
  },
  handleCompareExportClick: function(e) {
    e.preventDefault();
    var id = 'bubble-chart';
    var svg = document.querySelector('svg#' + id);
    // save if there is any SVG markup
    if (svg.outerHTML.length > 0) {
      var data = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
      saveAs(data, id + '.svg');
    }
  },
  handleResultsClearClick: function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to clear all results?')) {
      this.setState({results: []});
      this.setState({compare: false});
    }
  },
  handleResultsCompareClick: function(e) {
    e.preventDefault();
    this.setState({compare: !this.state.compare});
  },
  handleExploreViewClick: function(e) {
    e.preventDefault();
    var resultId = e.currentTarget.id,
    exploreWorker = new ExploreWorker();

    exploreWorker.postMessage({
      resultId: resultId,
      collections: this.state.collections
    });
    exploreWorker.onmessage = this.exploreWorkerOnMessage;
  },
  handleInputFileChange: function(e) {
    var file = e.target.files[0];
    this.setState({inputFile: file});
    this.setState({inputFileName: file.name});
  },
  handleInputSampleFileClick: function(e) {
    e.preventDefault();
    var sample = e.currentTarget.id;
    var sampleWorker = new SampleWorker();
    // toggle form
    this.togglePanelAnalyze();
    sampleWorker.postMessage(sample);
    sampleWorker.onmessage = this.sampleWorkerOnMessage;
  },
  handleSelectOrganismChange: function(e) {
    var organism = e.get(0).value;
    // update the organism in the state
    this.setState({inputOrganism: organism});
    this.setState({inputCollections: []});
  },
  handleSelectCollectionsChange: function(e) {
    var collection = e.get(0).value;
    var inputCollections = this.state.inputCollections;
    // if the selected collection is not in input
    if (_.indexOf(inputCollections, collection) !== -1) {
      inputCollections = _.pull(inputCollections, collection);
    } else {
      inputCollections.push(collection);
    }
    this.setState({inputCollections: inputCollections});
  },
  handleClickToggleParameters: function(e) {
    e.preventDefault();

    this.setState({areParametersVisible: !this.state.areParametersVisible});
  },
  handleSelectEnrichmentMethodChange: function(e) {
    var method = e.target.options[e.target.options.selectedIndex].value;

    this.setState({inputEnrichmentMethod: method});
  },
  handleSelectScoringMethodChange: function(e) {
    var method = e.target.options[e.target.options.selectedIndex].value;

    this.setState({inputScoringMethod: method});
  },
  handleSelectCorrectionMethodChange: function(e) {
    var method = e.target.options[e.target.options.selectedIndex].value;

    this.setState({inputCorrectionMethod: method});
  },
  handleGeneSetCutoffChange: function(e) {
    var val = e.target.value;
    if (val != '') {
      val = parseInt(val);
    }
    this.setState({inputGeneSetCutoff: val});
  },
  handleOverlapCutoffChange: function(e) {
    var val = e.target.value;
    if (val != '') {
      val = parseInt(val);
    }
    this.setState({inputOverlapCutoff: val});
  },
  handleSignificanceCutoffChange: function(e) {
    var val = e.target.value;
    if (val != '') {
      val = parseFloat(val);
    }
    this.setState({inputSignificanceCutoff:val});
  },
  handleNumberOfIterationsChange: function(e) {
    var val = e.target.value;
    if (val != '') {
      val = parseInt(val);
    }
    this.setState({inputNumberOfIterations: val});
  },
  handleInputSubmitClick: function(e) {
    e.preventDefault();
    var file = this.state.inputFile;
    var organism = this.state.inputOrganism;
    var collections = this.state.inputCollections;
    var enrichmentMethod = this.state.inputEnrichmentMethod;
    var scoringMethod = this.state.inputScoringMethod;
    var correctionMethod = this.state.inputCorrectionMethod;
    var geneSetCutoff = this.state.inputGeneSetCutoff;
    var overlapCutoff = this.state.inputOverlapCutoff;
    var significanceCutoff = this.state.inputSignificanceCutoff;
    var numberOfIterations = this.state.inputNumberOfIterations;
    var errors = [];

    if (file === undefined) {
      errors.push('Select a file');
    }
    if (organism === undefined) {
      errors.push('Select an organism');
    }
    if (collections.length == 0) {
      errors.push('Select at least one gene set collection');
    }
    // TODO: implement error checks for other parameters
    if (geneSetCutoff === '') {
      errors.push('Enter a positive number for gene set cutoff, default: 350');
    } else {
      if (geneSetCutoff < 0) {
        errors.push('Gene set cutoff cannot be a negative number, default: 350');
      }
    }
    if (overlapCutoff === '') {
      errors.push('Enter a positive number for overlap cutoff, default: 5');
    } else {
      if (overlapCutoff < 1) {
        errors.push('Overlap cutoff cannot be zero or a negative number, default: 5');
      }
    }
    if (significanceCutoff === '') {
      errors.push('Enter a decimal between 0 and 1 for significance cutoff, default: 0.05');
    } else {
      if (significanceCutoff < 0 || significanceCutoff > 1) {
        errors.push('Significance cutoff has to be between 0 and 1, default: 0.05');
      }
    }
    if (numberOfIterations === '') {
      errors.push('Enter a positive number larger than 1000 for number of iterations, default: 1000');
    } else {
      if (numberOfIterations < 1000) {
        errors.push('Number of interations has to be larger than or equal to 1000, default: 1000');
      }
    }
    if (errors.length > 0) {
      // push errors to the state
      this.setState({inputErrors: errors});
    } else {
      var mappingWorker = new MappingWorker();
      var results = this.state.results;

      // initiate a temporary result variable
      var result = {
        id: this.constructor.getResultIdFromFileName(this.state.inputFileName),
        title: this.state.inputFileName,
        summary: null,
        options: this.constructor.getDefaultResultOptions(),
        geneScores: [],
        organism: organism,
        enrichmentMethod: enrichmentMethod,
        shownPValue: null,
        collections: []
      };

      // remove previous errors from the state
      this.setState({inputErrors: []});
      // hide advanced parameters to save some space
      this.hideAdvancedParameters();
      // toggle form
      this.togglePanelAnalyze();
      // add running results to the results
      results.unshift(result);
      this.setState({results: results});
      this.setState({result: result});
      // start mapping worker to read and map the file
      mappingWorker.postMessage({file: file, organism: organism});
      mappingWorker.onmessage = this.mappingWorkerOnMessage;
      // add worker to the state
      this.setState({workers: this.state.workers.concat([mappingWorker])});
    }
  },
  handleInputCancelClick: function(e) {
    e.preventDefault();

    if (confirm('Are you sure you want to cancel this analysis?')) {
      this.cancelAnalysis();
    }
  },
  handleShownPValueChange: function(e) {
    var shownPValue = e.target.options[e.target.options.selectedIndex].value;
    var resultId = e.currentTarget.dataset.resultId;
    var results = this.state.results;

    results = results.map(function(result) {
      if (result.id == resultId) {
        result.shownPValue = shownPValue;
      }
      return result;
    });

    this.setState({results: results});
  },
  handleExportGeneScoresClick: function(e) {
    e.preventDefault();

    var resultId = e.currentTarget.dataset.resultId;
    var results = this.state.results;
    var result = results.filter(function(result) {
      return result.id == resultId;
    })[0];
    var tsv = ['Genes', 'Scores'].join('\t') + '\n';
    result.geneScores.forEach(function(geneScore) {
      tsv += [geneScore.gene, geneScore.score].join('\t') + '\n';
    });
    var data = new Blob([tsv], {type: 'text/tsv'});

    saveAs(data, resultId + '_gene_scores.tsv');
  },
  handleOptionsPercentChange: function(e) {
    var percent = e.target.value;
    var resultId = e.target.id;
    var results = this.state.results;

    results = results.map(function(result) {
      if (result.id == resultId) {
        result.options.percent = percent;
      }
      return result;
    });

    this.setState({results: results});
  },
  handleOptionsPValueChange: function(e) {
    var pValue = e.target.value;
    var resultId = e.target.id;
    var results = this.state.results;

    results = results.map(function(result) {
      if (result.id == resultId) {
        result.options.pValue = pValue;
      }
      return result;
    });

    this.setState({results: results});
  },
  handleExportBarChartClick: function(e) {
    e.preventDefault();

    var id = e.currentTarget.id;
    var svg = document.querySelector('svg#' + id);

    if (svg.outerHTML.length > 0) {
      var data = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
      saveAs(data, id + '.svg');
    }
  },
  handleExportTableClick: function(e) {
    e.preventDefault();

    var id = e.currentTarget.id;
    var resultId = id.split('__')[0];
    var collId = id.split('__')[1];
    var results = this.state.results;
    var result;
    var collection;

    result = results.filter(function(result) {
      return result.id == resultId;
    })[0];

    collection = result.collections.filter(function(coll) {
      return coll.id == collId;
    })[0];

    var tsv = [
      'Gene set ID',
      'Gene set',
      'Genes',
      'Overlap size',
      'Gene set size',
      'Percent',
      'Functional p-value',
      'Functional p-value corrected',
      'Gene set p-value'
    ].join('\t') + '\n';
    collection.data.forEach(function(row) {
      tsv += [
        row.geneSetId,
        row.geneSet,
        row.genes.join(', '),
        row.overlapSize,
        row.geneSetSize,
        row.percent,
        row.fPValue,
        row.fPValueCorr,
        row.gSPValue
      ].join('\t') + '\n';
    });
    var data = new Blob([tsv], {type: 'text/tsv'});

    saveAs(data, id + '.tsv');
  },
  exploreWorkerOnMessage: function(e) {
    var component = this;
    var results = component.state.results;
    var result = e.data;

    // add missing result attributes
    result['summary'] = component.props.explore.filter(function(item) {
      return item.id == result.id;
    })[0];
    result['title'] = result.summary.symbol + ' / ' + result.summary.cellLine;
    result['options'] = component.constructor.getDefaultResultOptions();
    result['geneScores'] = [];
    result['organism'] = 'hsa_hg19';
    result['shownPValue'] = 'gSPValue';
    result['enrichmentMethod'] = 'both';
    // add the complete result to the results in the state
    results.unshift(result);

    component.setState({results: results});
  },
  sampleWorkerOnMessage: function(e) {
    this.setState({inputFile: e.data.file});
    this.setState({inputFileName: e.data.name});
    // toggle form
    this.togglePanelAnalyze();
  },
  mappingWorkerOnMessage: function(e) {
    var geneScores = e.data;
    var result = this.state.result;
    var organism = this.state.inputOrganism;
    var collections = this.props.collections;
    var collectionWorker;

    // add gene scores to the running result
    result.geneScores = geneScores;
    this.setState({result: result});
    // collect all collections
    collectionWorker = new CollectionWorker();
    collectionWorker.postMessage({
      organism: organism,
      collections: collections,
    });
    collectionWorker.onmessage = this.collectionWorkerOnMessage;
    // add worker to the state
    this.setState({workers: this.state.workers.concat([collectionWorker])});
  },
  collectionWorkerOnMessage: function(e) {
    var component = this;
    var inputCollections = component.state.inputCollections;
    var geneScores = component.state.result.geneScores;
    var geneSetCollections = e.data;
    var enrichmentMethod = component.state.inputEnrichmentMethod;
    var scoringMethod = component.state.inputScoringMethod;
    var correctionMethod = component.state.inputCorrectionMethod;
    var geneSetCutoff = component.state.inputGeneSetCutoff;
    var overlapCutoff = component.state.inputOverlapCutoff;
    var significanceCutoff = component.state.inputSignificanceCutoff;
    var numberOfIterations = component.state.inputNumberOfIterations;
    var enrichmentWorker;

    // store gene collections in the state
    component.setState({geneSetCollections: geneSetCollections});

    // start an enrichment worker for each collection
    inputCollections.forEach(function(inputCollection) {
      enrichmentWorker = new EnrichmentWorker();
      enrichmentWorker.postMessage({
        'geneScores': geneScores,
        'geneSetCollection': geneSetCollections.collections[inputCollection],
        'geneSetCollectionsSize': geneSetCollections.size,
        'enrichmentMethod': enrichmentMethod,
        'scoringMethod': scoringMethod,
        'correctionMethod': correctionMethod,
        'geneSetCutoff': geneSetCutoff,
        'overlapCutoff': overlapCutoff,
        'significanceCutoff': significanceCutoff,
        'numberOfIterations': numberOfIterations
      });
      enrichmentWorker.onmessage = component.enrichmentWorkerOnMessage;
      // add worker to the state
      component.setState({workers: component.state.workers.concat([enrichmentWorker])});
    });
  },
  enrichmentWorkerOnMessage: function(e) {
    var currentCollection = e.data;
    var results = this.state.results;
    var result = this.state.result;
    // add current collection to the running result in the state
    result.collections.push(currentCollection);

    // update running result in results in the state
    this.setState({results: results.map(function(r) {
      // update the running result element in results
      if (r.id == result.id) {
        r = result;
      }
      return r;
    })});
    // check if job is complete
    if (result.collections.length == this.state.inputCollections.length) {
      this.completeAnalysis();
    }
  },
  render: function() {
    var errors;
    var progress;

    if (this.state.inputErrors.length > 0) {
      errors = (
        <div className="alert alert-danger" role="alert">
          Please correct following error(s):
          <ul>
            { this.state.inputErrors.map(function (error, i) {
              return (
                <li key={'item' + i}>
                  { error }
                </li>
              );
            }) }
          </ul>
        </div>
      );
    }
    if (this.state.result !== undefined &&
        this.state.inputCollections !== undefined) {
      progress = Math.round(
        100 * (this.state.result.collections.length /
              this.state.inputCollections.length)
      );
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            { errors }
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <PanelExplore
              explore={this.props.explore}
              onExploreSearchChange={this.handleExploreSearchChange}
              onExploreViewClick={this.handleExploreViewClick}
              onExploreCompareClick={this.handleExploreCompareClick}
              />
          </div>
          <div className="col-sm-8">
            <PanelAnalyze
              samples={this.props.samples}
              organisms={this.props.organisms}
              collections={this.props.collections}
              enrichmentMethods={this.props.enrichmentMethods}
              scoringMethods={this.props.scoringMethods}
              correctionMethods={this.props.correctionMethods}
              inputFileName={this.state.inputFileName}
              inputOrganism={this.state.inputOrganism}
              inputCollections={this.state.inputCollections}
              inputEnrichmentMethod={this.state.inputEnrichmentMethod}
              inputScoringMethod={this.state.inputScoringMethod}
              inputCorrectionMethod={this.state.inputCorrectionMethod}
              inputGeneSetCutoff={this.state.inputGeneSetCutoff}
              inputOverlapCutoff={this.state.inputOverlapCutoff}
              inputSignificanceCutoff={this.state.inputSignificanceCutoff}
              inputNumberOfIterations={this.state.inputNumberOfIterations}
              areParametersVisible={this.state.areParametersVisible}
              disabled={this.state.isRunning}
              onInputFileChange={this.handleInputFileChange}
              onInputSampleFileClick={this.handleInputSampleFileClick}
              onSelectOrganismChange={this.handleSelectOrganismChange}
              onSelectCollectionsChange={this.handleSelectCollectionsChange}
              onClickToggleParameters={this.handleClickToggleParameters}
              onSelectEnrichmentMethodChange={this.handleSelectEnrichmentMethodChange}
              onSelectScoringMethodChange={this.handleSelectScoringMethodChange}
              onSelectCorrectionMethodChange={this.handleSelectCorrectionMethodChange}
              onGeneSetCutoffChange={this.handleGeneSetCutoffChange}
              onOverlapCutoffChange={this.handleOverlapCutoffChange}
              onSignificanceCutoffChange={this.handleSignificanceCutoffChange}
              onNumberOfIterationsChange={this.handleNumberOfIterationsChange}
              onInputSubmitClick={this.handleInputSubmitClick}
              onInputCancelClick={this.handleInputCancelClick}
              />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <ResultGroup
              results={this.state.results}
              collections={this.props.collections}
              inputCollectionsCompared={this.state.inputCollectionsCompared}
              compare={this.state.compare}
              progress={progress}
              isRunning={this.state.isRunning}
              onCompareCollectionsChange = {this.handleCompareCollectionsChange}
              onCompareExportClick = {this.handleCompareExportClick}
              onResultsClearClick = {this.handleResultsClearClick}
              onResultsCompareClick = {this.handleResultsCompareClick}
              onShownPValueChange={this.handleShownPValueChange}
              onExportGeneScoresClick={this.handleExportGeneScoresClick}
              onOptionsPercentChange={this.handleOptionsPercentChange}
              onOptionsPValueChange={this.handleOptionsPValueChange}
              onExportBarChartClick={this.handleExportBarChartClick}
              onExportTableClick={this.handleExportTableClick}
              />
          </div>
        </div>
      </div>
    );
  }
});

export default App;