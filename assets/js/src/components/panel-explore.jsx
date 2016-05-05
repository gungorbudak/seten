import React from 'react';
import PanelExploreItem from './panel-explore-item';

var PanelExplore = React.createClass({
  getInitialState: function() {
    return {
      explore: this.props.explore
    }
  },
  handleSearchChange: function(e) {
    var query = e.target.value.toLowerCase();
    var explore = this.props.explore;

    if (query.length > 0) {
      this.setState({explore: explore.filter(function(item) {
        return item.symbol.toLowerCase().startsWith(query);
      })});
    } else {
      this.setState({explore: explore});
    }
  },
  render: function() {
    var component = this;
    var items;

    if (component.state.explore.length > 0) {
      items = component.state.explore.map(function(item, i) {
        return (
          <PanelExploreItem
            item={item}
            key={'item' + i}
            onExploreViewClick={component.props.onExploreViewClick}
            onExploreCompareClick={component.props.onExploreCompareClick}
            />
        );
      });
    } else {
      items = (
        <div className="list-group-item">
          Your search did not match any RBPs.
        </div>
      );
    }

    return (
      <div className="panel panel-info panel-explore">

        <div className="panel-heading">
          <h3 className="panel-title">
            <i className="fa fa-globe">
            </i>
            <span>&nbsp;Explore</span>
            &nbsp;
            <span className="badge">
              { component.state.explore.length } dataset(s)
            </span>
          </h3>
        </div>

        <div className="list-group">
          <div className="list-group-item form-group has-feedback has-search">
            <span className="glyphicon glyphicon-search form-control-feedback">
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for an RBP"
              onChange={component.handleSearchChange}
              />
          </div>
        </div>

        <div className="list-group list-group-explore">
          {items}
        </div>

      </div>
    );
  }
});

export default PanelExplore;
