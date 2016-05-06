import React from 'react';
import ResultGroupTitle from './result-group-title';
import ResultGroupProgressBar from './result-group-progress-bar';
import ResultGroupCompareBubbleChart from './result-group-compare-bubble-chart';
import Result from './result';


var ResultGroup = React.createClass({
  render: function() {
    var component = this;
    var title = null;
    var progressBar = null;
    var bubbleChart = null;
    var results = null;
    var view = null;

    if (component.props.results.length > 0) {
      title = (
        <div>
          <ResultGroupTitle
            compare={component.props.compare}
            collections={component.props.collections}
            inputCollectionsCompared={component.props.inputCollectionsCompared}
            onCompareCollectionsChange={component.props.onCompareCollectionsChange}
            onCompareExportClick={component.props.onCompareExportClick}
            onResultsClearClick={component.props.onResultsClearClick}
            onResultsCompareClick={component.props.onResultsCompareClick}
            />
          <hr />
        </div>
      );

      if (component.props.compare) {
        bubbleChart = (
          <ResultGroupCompareBubbleChart
            results={component.props.results}
            inputCollectionsCompared={component.props.inputCollectionsCompared}
            />
        );

        view = (
          <div>
            { title }
            { bubbleChart }
          </div>
        );
      } else {
        progressBar = (
          <ResultGroupProgressBar
            progress={component.props.progress}
            />
        );

        results = component.props.results.map(function(result, i) {
          return (
            <div key={'item' + i}>
              <Result
                result={result}
                progress={component.props.progress}
                onShownPValueChange={component.props.onShownPValueChange}
                onExportGeneScoresClick={component.props.onExportGeneScoresClick}
                onOptionsPercentChange={component.props.onOptionsPercentChange}
                onOptionsPValueChange={component.props.onOptionsPValueChange}
                onExportBarChartClick={component.props.onExportBarChartClick}
                onExportTableClick={component.props.onExportTableClick}
                />
              <hr/>
            </div>
          );
        });

        view = (
          <div>
            { title }
            { progressBar }
            { results }
          </div>
        );
      }
    }

    return (
      <div>
        { view }
      </div>
    );
  }
});


export default ResultGroup;
