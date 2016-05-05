import React from 'react';
import ReactDOM from 'react-dom';
import { saveAs } from 'filesaver.js';
import ResultCollectionTableHeader from './result-collection-table-header';
import ResultCollectionTableBody from './result-collection-table-body';
import ResultCollectionTableModal from './result-collection-table-modal';

var ResultCollectionTable = React.createClass({
  getInitialState: function() {
    var shownPValue = this.props.shownPValue;
    var enrichmentMethod = this.props.enrichmentMethod;
    var pValueCondition = enrichmentMethod == 'gse' ||
      (enrichmentMethod == 'both' && shownPValue == 'gSPValue');
    var sort;

    if (pValueCondition) {
      sort = {
        id: 'gSPValue',
        direction: 'asc'
      };
    } else {
      sort = {
        id: 'fPValueCorr',
        direction: 'asc'
      };
    }

    return {
      sort: sort,
      isModalOpen: true,
      modalTitle: '',
      geneSetId: '',
      geneScores: []
    };
  },
  componentDidMount: function() {
    $(ReactDOM.findDOMNode(this.refs.modal)).modal({show: false});
  },
  handleSortClick: function(e) {
    var id = e.currentTarget.id;
    var sort = this.state.sort;
    // new sort object
    var _sort = {
      id: id,
      direction: (sort.direction == 'asc') ? 'desc': 'asc'
    };
    // replace sort with the new sort object
    this.setState({
      sort: _sort
    });
  },
  handleGenesClick: function(e) {
    e.preventDefault();
    var data = this.props.data;
    var geneSetId = e.currentTarget.dataset.geneSetId;
    var row = data.filter(function(d) {
      return d.geneSetId == geneSetId;
    })[0];
    var modalTitle = [
      'Viewing ',
      row.overlapSize, '/', row.geneSetSize,
      ' (', row.percent, '%) ',
      ' genes and their scores'
    ].join('');

    $(ReactDOM.findDOMNode(this.refs.modal)).modal('show');
    this.setState({
      isModalOpen: true,
      modalTitle: modalTitle,
      geneSetId: geneSetId,
      geneScores: row.geneScores
    });
  },
  handleModalExportClick: function(e) {
    e.preventDefault();
    var data = this.props.data;
    var geneSetId = e.currentTarget.dataset.geneSetId;
    var row = data.filter(function(d) {
      return d.geneSetId == geneSetId;
    })[0];
    var tsv = ['Genes', 'Scores'].join('\t') + '\n';

    row.geneScores.forEach(function(geneScore) {
      tsv += [geneScore.gene, geneScore.score].join('\t') + '\n';
    });
    var data = new Blob([tsv], {type: 'text/tsv'});

    saveAs(data, geneSetId + '_gene_scores.tsv');
  },
  render: function() {
    var component = this;
    var sort = component.state.sort;
    var data = component.props.data;
    var shownPValue = component.props.shownPValue;
    var enrichmentMethod = component.props.enrichmentMethod;
    var pValueCondition = enrichmentMethod == 'gse' ||
      (enrichmentMethod == 'both' && shownPValue == 'gSPValue');
    var columns = [];

    if (pValueCondition) {
      if (sort.id == 'fPValue' || sort.id == 'fPValueCorr') {
        sort = {
          id: 'gSPValue',
          direction: 'asc'
        };
      }
      columns = [
        {id: 'geneSet' , name: 'Gene set'},
        {id: 'percent', name: '%'},
        {id: 'gSPValue', name: 'G. set p-value'}
      ];
    } else {
      if (sort.id == 'gSPValue') {
        sort = {
          id: 'fPValueCorr',
          direction: 'asc'
        };
      }
      columns = [
        {id: 'geneSet' , name: 'Gene set'},
        {id: 'percent', name: '%'},
        {id: 'fPValue', name: 'Func. p-value'},
        {id: 'fPValueCorr', name: 'Func. p-value corr.'}
      ];
    }

    // sort data according to sort object in the state
    data = data.sort(function(a, b) {
      if (sort.id == 'geneSet') {
        return (sort.direction == 'asc') ?
          a[sort.id].localeCompare(b[sort.id]):
          b[sort.id].localeCompare(a[sort.id]);
      }
      return (sort.direction == 'asc') ?
        a[sort.id] - b[sort.id]:
        b[sort.id] - a[sort.id];
    });
    // is there any data?
    if (data.length > 0) {
      return (
        <div>
          <div className="table-responsive table-responsive-panel">
            <table className="table table-striped table-hover table-panel">
              <ResultCollectionTableHeader
                columns={columns}
                sort={sort}
                onSortClick={component.handleSortClick}
                />
              <ResultCollectionTableBody
                data={data}
                shownPValue={component.props.shownPValue}
                enrichmentMethod={component.props.enrichmentMethod}
                onGenesClick={this.handleGenesClick}
                />
            </table>
          </div>
          <ResultCollectionTableModal
            ref="modal"
            modalTitle={this.state.modalTitle}
            isModalOpen={this.state.isModalOpen}
            geneSetId={this.state.geneSetId}
            geneScores={this.state.geneScores}
            organism={this.props.organism}
            onModalExportClick={this.handleModalExportClick}
            />
        </div>
      );
    } else {
      return (
        <div className="panel-body">
          No significant results available.
        </div>
      )
    }
  }
});

export default ResultCollectionTable;
