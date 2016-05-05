import React from 'react';

var ResultCollectionTableModal = React.createClass({
    render: function() {
        if (this.props.isModalOpen === false) {
            return null;
        }
        var organism = this.props.organism.split('_')[0];
        var urlPrefix = 'http://www.genecards.org/cgi-bin/carddisp.pl?gene=';
        var urlPrefixName = 'GeneCards';
        if (organism == 'mmu') {
          urlPrefix = "http://www.informatics.jax.org/marker/summary?nomen=";
          urlPrefixName = 'MGI';
        } else if (organism == 'rno') {
          urlPrefix = "http://rgd.mcw.edu/rgdweb/search/genes.html?speciesType=3&obj=gene&term=";
          urlPrefixName = 'RGD';
        } else if (organism == 'dme') {
          urlPrefix = "http://flybase.org/cgi-bin/quicksearch_solr.cgi?caller=quicksearch&tab=basic_tab&data_class=FBgn&species=Dmel&search_type=all&context=";
          urlPrefixName = 'FlyBase';
        } else if (organism == 'cel') {
          urlPrefix = "http://www.wormbase.org/search/gene/";
          urlPrefixName = 'WormBase';
        } else if (organism == 'sce') {
          urlPrefix = "http://yeastmine.yeastgenome.org/yeastmine/keywordSearchResults.do?searchSubmit=search&searchTerm=";
          urlPrefixName = 'SGD';
        }

        return (
            <div className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{this.props.modalTitle}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive table-responsive-modal">
                                <table className="table table-condensed table-striped table-hover table-modal">
                                    <thead>
                                        <tr>
                                            <th>Gene</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.geneScores.map(function(geneScore, i) {
                                            return (
                                                <tr key={'item' + i}>
                                                    <td>
                                                        <a
                                                            href={urlPrefix + geneScore.gene}
                                                            title={"View " + geneScore.gene + " on " + urlPrefixName}
                                                            target="_blank"
                                                            >
                                                            {geneScore.gene}
                                                        </a>
                                                    </td>
                                                    <td>{parseFloat(geneScore.score.toPrecision(2))}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                title="Export the genes and their scores as TSV"
                                data-gene-set-id={this.props.geneSetId}
                                onClick={this.props.onModalExportClick}
                                >
                                <span><i className="fa fa-table"></i>&nbsp;Export</span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-default btn-sm"
                                data-dismiss="modal"
                                >
                                <i className="fa fa-times-circle"></i>&nbsp;Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default ResultCollectionTableModal;
