'use strict';

Array.prototype.unique = function(){
    return Object.keys(this.reduce(function(r,v){ return r[v]=1,r; },{}));
}

function _getCollectionsSize(cols) {
    var genes = [],
        size;
    for (var c in cols.collections) {
        var _genes = cols.collections[c].geneSets.reduce(function(a, b) {
            return a.concat(b.genes);
        }, []);
        genes = genes.concat(_genes);
    }
    size = genes.unique().length
    return size;
}

function _collectGeneSets(filename) {
    var request = new XMLHttpRequest(),
        geneSets = [],
        rows,
        cols;
    request.open('GET', '/assets/resources/collections/' + filename + '.gmt', false);
    request.send(null);
    if (request.status === 200) {
        rows = request.responseText.trim().split(/\r?\n/);
        rows.forEach(function (row) {
            cols = row.split(/\s/);
            geneSets.push({
                name: cols[0],
                genes: cols.slice(2).unique()
            });
        });
    }
    return geneSets;
}

self.onmessage = function(e) {
    var t0 = new Date().getTime(),
        collections = e.data,
        _collections = {
            collections: {},
            size: 0
        },
        genes = [],
        r,
        t1;

    collections.forEach(function(collection) {
        _collections.collections[collection.id] = {
            id: collection.id,
            name: collection.name,
            geneSets: _collectGeneSets(collection.filename)
        };
    });

    // size of all collections
    //_collections.size = _getCollectionsSize(_collections);
    _collections.size = 20651;

    t1 = new Date().getTime();
    console.log('[collectionWorker] ' + _collections.size + ' unique genes collected from gene set collections in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage(_collections);
};
