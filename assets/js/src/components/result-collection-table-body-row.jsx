import React from 'react';

var ResultCollectionTableBodyRow = React.createClass({
  render: function() {
    var row = this.props.row;
    var shownPValue = this.props.shownPValue;
    var enrichmentMethod = this.props.enrichmentMethod;
    var pValueCondition = enrichmentMethod == 'gse' ||
      (enrichmentMethod == 'both' && shownPValue == 'gSPValue');
    var geneSet;
    var percent;
    var pValue;
    var pValueCorr;

    if (row.geneSet.length > 90) {
      geneSet = (
        <td>
          <abbr title={row.geneSet}>
            { row.geneSet.substr(0, 90) + "..." }
          </abbr>
        </td>
      );
    } else {
      geneSet = (
        <td>
          { row.geneSet }
        </td>
      );
    }

    if (row.geneScores !== null) {
      percent = (
        <td>
          <a
            href="#"
            title={"View " + row.overlapSize + "/" + row.geneSetSize + " genes and their scores"}
            data-gene-set-id={row.geneSetId}
            onClick={this.props.onGenesClick}
            >
            {row.percent}
          </a>
        </td>
      );
    } else {
      percent = (
        <td>
          <abbr
            title={row.overlapSize + "/" + row.geneSetSize}
            >
            {row.percent}
          </abbr>
        </td>
      );
    }

    if (pValueCondition) {
      pValue = (
        <td>
          { row.gSPValue.toPrecision(3) }
        </td>
      );
    } else {
      pValue = (
        <td>
          { row.fPValue.toPrecision(3) }
        </td>
      );
      pValueCorr = (
        <td>
          { row.fPValueCorr.toPrecision(3) }
        </td>
      );
    }

    return (
      <tr>
        { geneSet }
        { percent }
        { pValue }
        { pValueCorr }
      </tr>
    );
  }
});

export default ResultCollectionTableBodyRow;
