import React from 'react';
import ReactDOM from 'react-dom';

var PanelExploreItem = React.createClass({
  componentDidMount: function() {
    var $item = $(ReactDOM.findDOMNode(this));

    $item.find('a#information').popover({
      container: '.container-app',
      placement: 'auto',
      html: true
    });
  },
  render: function() {
    var item = this.props.item;
    item.name = item.symbol + ' / ' + item.cellLine;
    var itemSummary = [
      '<table class="table table-condensed table-popover">',
      '<tbody>',
      '<tr><th>Symbol</th><td>' + item.symbol + '</td></tr>',
      '<tr><th>Cell line</th><td>' + item.cellLine + '</td></tr>',
      '<tr><th>Species</th><td>' + item.species + '</td></tr>',
      '<tr><th>Disease state</th><td>' + item.diseaseState + '</td></tr>',
      '</tbody>',
      '</table>'
    ].join('');
    return (
      <div className="list-group-item">
        <span
          className="label label-info"
          title={item.id.split('-')[0].toUpperCase()}>
          {item.id.substr(0, 1).toUpperCase()}
        </span>
        <button
          href="#"
          id={item.id}
          className="btn btn-link btn-xs"
          title={'Load precomputed enrichment results for ' + item.name}
          onClick={this.props.onExploreViewClick}
          >
          {item.name}
        </button>
        <a
          tabIndex="0"
          className="btn btn-link btn-xs"
          role="button"
          id="information"
          title={item.name}
          data-original-title={item.name}
          data-content={itemSummary}
          data-trigger="focus"
          >
          <i className="fa fa-info-circle">
          </i>
        </a>
      </div>
    );
  }
});

export default PanelExploreItem;
