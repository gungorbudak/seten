import React from 'react';
import * as _ from 'lodash';
import ResultTitle from './result-title';
import ResultSummary from './result-summary';
import ResultOptions from './result-options';
import ResultCollection from './result-collection';

var Result = React.createClass({
  render: function() {
    var component = this;
    var isShownPValueSwitchable = this.props.result.shownPValue !== null;
    var isExportable = _.has(component.props.result, 'geneScores') &&
      component.props.result.geneScores.length > 0;
    var summary;
    var options;

    if (component.props.result.summary != null) {
      summary = (
        <ResultSummary
          summary={component.props.result.summary}
          />
      );
    }

    if (component.props.result.collections.length > 0) {
      options = (
        <ResultOptions
          resultId={component.props.result.id}
          options={component.props.result.options}
          onOptionsPercentChange={component.props.onOptionsPercentChange}
          onOptionsPValueChange={component.props.onOptionsPValueChange}
          />
      );
    }

    return (
      <div>
        <ResultTitle
          resultId={component.props.result.id}
          title={component.props.result.title}
          enrichmentMethod={component.props.result.enrichmentMethod}
          shownPValue={component.props.result.shownPValue}
          isShownPValueSwitchable={isShownPValueSwitchable}
          isExportable={isExportable}
          onShownPValueChange={component.props.onShownPValueChange}
          onExportGeneScoresClick={component.props.onExportGeneScoresClick}
          />
        { summary }
        { options }
        <div className="panel-group" aria-multiselectable="true">
          { component.props.result.collections.map(function(collection, i) {
              return (
                <ResultCollection
                  key={'item' + i}
                  collection={collection}
                  resultId={component.props.result.id}
                  options={component.props.result.options}
                  organism={component.props.result.organism}
                  shownPValue={component.props.result.shownPValue}
                  enrichmentMethod={component.props.result.enrichmentMethod}
                  onExportBarChartClick={component.props.onExportBarChartClick}
                  onExportTableClick={component.props.onExportTableClick}
                  />
              );
          }) }
        </div>
      </div>
    );
  }
});

export default Result;
