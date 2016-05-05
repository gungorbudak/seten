import React from 'react';
import ResultCollectionBarChart from './result-collection-bar-chart';
import ResultCollectionTable from './result-collection-table';

var ResultCollection = React.createClass({
  render: function() {
    var component = this;
    var collection = component.props.collection;
    var uniqueId = component.props.resultId + '__' + collection.id;
    var data = collection.data.filter(function(item) {
      var percent = item.percent >= component.props.options.percent;
      var pValue;
      if (component.props.enrichmentMethod == 'gse') {
        pValue = item.gSPValue <= component.props.options.pValue;
      } else if (component.props.enrichmentMethod == 'fe') {
        pValue = item.fPValueCorr <= component.props.options.pValue;
      } else if (component.props.enrichmentMethod == 'both') {
        pValue = item[component.props.shownPValue] <= component.props.options.pValue;
      }
      return percent && pValue;
    });
    var exportButtons;
    var barChart;

    // is there any data?
    if (data.length > 0) {
      exportButtons = (
        <div className="col-xs-4 text-right">
          <span className="hidden-xs">Export&nbsp;</span>
          <button
            className="btn btn-default btn-xs"
            id={uniqueId}
            onClick={component.props.onExportBarChartClick}
            title="Export bar chart as SVG"
            >
            <i className="fa fa-bar-chart fa-fw">
            </i>
          </button>
          &nbsp;
          <button
            className="btn btn-default btn-xs"
            id={uniqueId}
            onClick={component.props.onExportTableClick}
            title="Export table as TSV"
            >
            <i className="fa fa-table fa-fw">
            </i>
          </button>
        </div>
      );
      barChart = (
        <ResultCollectionBarChart
          id={uniqueId}
          data={data}
          shownPValue={component.props.shownPValue}
          enrichmentMethod={component.props.enrichmentMethod}
          />
      );
    }

    return (
      <div className="panel panel-primary">
        <div
          className="panel-heading"
          role="tab"
          id={'heading-' + uniqueId}>
          <div className="row flex-align flex-align-center">
            <div className="col-xs-8">
              <h4 className="panel-title">
                <span className="badge">
                  { data.length }
                </span>
                &nbsp;
                <a
                  className="collapsed"
                  role="button"
                  data-toggle="collapse"
                  href={'#collapse-' + uniqueId}
                  aria-expanded="true"
                  aria-controls={'collapse-' + uniqueId}
                  >
                  { collection.title }
                </a>
              </h4>
            </div>
            { exportButtons }
          </div>
        </div>
        <div
          id={'collapse-' + uniqueId}
          className="panel-collapse collapse"
          role="tabpanel"
          aria-labelledby={'heading-' + uniqueId}
          >
          { barChart }
          <ResultCollectionTable
            collection={collection}
            data={data}
            organism={component.props.organism}
            shownPValue={component.props.shownPValue}
            enrichmentMethod={component.props.enrichmentMethod}
            />
        </div>
      </div>
    );
  }
});

export default ResultCollection;
