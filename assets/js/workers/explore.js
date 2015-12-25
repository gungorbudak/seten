'use strict';

function _collectResult(name, collection_id) {
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

function collectResults(result, collections) {
    var result = result.split('-'),
        name = [result[0], result.slice(1, result.length).join('-')].join('/'),
        results = [],
        rows,
        cols;

    collections.forEach(function (collection) {
        var enrichment = [];

        rows = _collectResult(name, collection.id);
        if (rows.length > 0) {
            rows.forEach(function (row) {
                cols = row.split(/\t/);
                enrichment.push({
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

            enrichment = enrichment.sort(function(a, b) {
                return a.cPValue - b.cPValue;
            });

            results.push({
                id: collection.id,
                title: collection.name,
                enrichment: enrichment
            });
        }
    });

    return results;
}

self.onmessage = function(e) {
    var t0 = new Date().getTime(),
        result = e.data.result,
        cols = e.data.collections,
        results,
        t1;

    results = collectResults(result, cols);

    console.log('[exploreWorker] ' + results.length + ' gene collection(s) collected');
    t1 = new Date().getTime();
    console.log('[exploreWorker] Completed in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage(results);
};
