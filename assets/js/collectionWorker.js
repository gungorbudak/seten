'use strict';

Array.prototype.unique = function() {
    var a = [];
    for (var i=0, l=this.length; i<l; i++)
        if (a.indexOf(this[i]) === -1)
            a.push(this[i]);
    return a;
}

function collectGeneSets(filename) {
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
                genes: cols.slice(2, cols.length)
            });
        });
    }
    return geneSets;
}

self.onmessage = function(e) {
    var t0 = performance.now(),
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
            geneSets: collectGeneSets(collection.filename)
        };
    });

    // size of all collections
    _collections.size = 20651;

    t1 = performance.now();
    console.log('[collectionWorker] ' + _collections.size + ' unique genes collected from gene set collections in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage(_collections);
};
