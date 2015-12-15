'use strict';

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
                genes: cols.slice(2, cols.length - 1)
            });
        });
    }
    return geneSets;
}

self.onmessage = function(e) {
    var t0 = performance.now(),
        collection = e.data,
        _collection,
        t1;

    _collection = {
        id: collection.id,
        name: collection.name,
        geneSets: collectGeneSets(collection.filename)
    }

    t1 = performance.now();
    console.log('[collectionWorker] ' + Object.keys(_collection.geneSets).length + ' gene sets collected from ' + _collection.name + ' in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage(_collection);
};
