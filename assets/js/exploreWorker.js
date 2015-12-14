'use strict';

function collectResults(result, collections) {
    var request = new XMLHttpRequest(),
        name = result.split('-').join('/'),
        results = [],
        rows,
        cols;

    collections.forEach(function (collection) {
        var enrichment = [];
        request.open('GET', '/assets/resources/explore/' + name + '-' + collection.value + '.tsv', false);
        request.send(null);
        if (request.status === 200) {
            rows = request.responseText.trim().split(/\r?\n/);
            rows.shift();
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
        }
        enrichment = enrichment.sort(function(a, b) {
            return a.cPValue - b.cPValue;
        });
        results.push({
            id: collection.value,
            title: collection.label,
            enrichment: enrichment
        });
    });

    return results;
}

self.onmessage = function(e) {
    var t0 = performance.now(),
        result = e.data.result,
        col = e.data.collections,
        results,
        t1;

    results = collectResults(result, col);

    console.log('[exploreWorker] ' + results.length + ' gene collection(s) collected');
    t1 = performance.now();
    console.log('[exploreWorker] Completed in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage(results);
};
