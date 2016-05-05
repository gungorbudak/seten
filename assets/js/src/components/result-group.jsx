import React from 'react';
import ResultGroupTitle from './result-group-title';
import ResultGroupProgressBar from './result-group-progress-bar';
import ResultGroupCompareBubbleChart from './result-group-compare-bubble-chart';
import Result from './result';

var ResultGroup = React.createClass({
  render: function() {
    var component = this;
    var view;

    if (component.props.results.length > 0) {
      if (component.props.compare) {
        view = (
          <ResultGroupCompareBubbleChart
            results={component.props.results}
            inputCollectionsCompared={component.props.inputCollectionsCompared}
            />
        );
      } else {
        view = component.props.results.map(function(result, i) {
          return (
            <div key={'item' + i}>
              <Result
                result={result}
                progress={component.props.progress}
                isRunning={component.props.isRunning}
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
      }

      return (
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
          <ResultGroupProgressBar
            progress={component.props.progress}
            show={component.props.isRunning}
            />
          { view }
        </div>
      );
    } else {
      return (
        <div>
        </div>
      );
    }
  }
});

export default ResultGroup;
