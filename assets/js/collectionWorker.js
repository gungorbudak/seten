'use strict';

function collectGeneSets(colName) {
    var request = new XMLHttpRequest(),
        sets = {},
        rows,
        cols;
    request.open('GET', '/assets/resources/collections/' + colName + '.gmt', false);
    request.send(null);
    if (request.status === 200) {
        rows = request.responseText.trim().split(/\r?\n/);
        rows.forEach(function (row) {
            cols = row.split(/\s/);
            sets[cols[0]] = cols.slice(2, cols.length - 1);
        });
    }
    return sets;
}

self.onmessage = function(e) {
    var t0 = performance.now(),
        colName = e.data,
        col,
        t1;

    col = collectGeneSets(colName)

    t1 = performance.now();
    console.log('[collectionWorker] ' + Object.keys(col).length + ' gene sets collected from ' + colName + ' in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage(col);
};
