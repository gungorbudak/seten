import React from 'react';

var ResultCollectionTableHeaderSortIcon = React.createClass({
    render: function() {
        var direction = (this.props.direction !== null) ? '-' + this.props.direction: '';
        return (
            <i className={"fa fa-fw fa-sort" + direction}></i>
        );
    }
});

export default ResultCollectionTableHeaderSortIcon;
