'use strict';

function _collectResultCollection(name, collection_id) {
    var request = new XMLHttpRequest(),
        rows;
    request.open('GET', '/assets/resources/explore/' + name + '-' + collection_id + '.tsv', false);
    request.send(null);
    if (request.status === 200) {
        rows = request.responseText.trim().split(/\r?\n/);
        // get rid of the header line
        rows.shift();
        return rows;
    }
    return [];
}

function collectResult(resultId, collections) {
    var result = resultId.split('-'),
        name = [result[0], result.slice(1, result.length).join('-')].join('/'),
        result = {id: resultId, collections: []},
        rows,
        cols;

    collections.forEach(function (collection) {
        var data = [];

        rows = _collectResultCollection(name, collection.id);
        if (rows.length > 0) {
            rows.forEach(function (row) {
                cols = row.split(/\t/);
                data.push({
                    geneSet: cols[0],
                    genes: cols[1].split(', '),
                    overlapSize: parseInt(cols[2]),
                    geneSetSize: parseInt(cols[3]),
                    percent: parseInt(cols[4]),
                    fPValue: parseFloat(cols[5]),
                    fPValueCorr: parseFloat(cols[6]),
                    gSPValue: parseFloat(cols[7]),
                    cPValue: parseFloat(cols[8])
                });
            });

            data = data.sort(function(a, b) {
                return a.cPValue - b.cPValue;
            });

            result.collections.push({
                id: collection.id,
                title: collection.name,
                data: data
            });
        }
    });

    return result;
}

self.onmessage = function(e) {
    var t0 = new Date().getTime(),
        resultId = e.data.resultId,
        cols = e.data.collections,
        result,
        t1;

    result = collectResult(resultId, cols);

    console.log('[exploreWorker] ' + result.collections.length + ' gene collection(s) collected');
    t1 = new Date().getTime();
    console.log('[exploreWorker] Completed in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage(result);
};
