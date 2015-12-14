'use strict';

importScripts('libs/mannwhitneyu.js', 'libs/fishersexact.js');

function _overlap(a, b) {
    var rs = [],
        i = a.length;
    while (i--) b.indexOf(a[i]) != -1 && rs.push(a[i]);
    return rs;
}

function _scores(geneScores, genes) {
    var rs = [],
        i = genes.length;
    while (i--) rs.push(geneScores[genes[i]]);
    return rs;
}

function _randomScores(scores, i) {
    var rs = [],
        n = scores.length;
    while (i--) rs.push(scores[Math.floor(Math.random() * n)]);
    return rs;
}

function _median(values) {
    values.sort(function(a, b) {
        return a - b;
    });
    var half = Math.floor(values.length / 2);
    if (values.length % 2)
        return values[half];
    else
        return (values[half - 1] + values[half]) / 2.0;
};

function _mwu(a, b) {
    var r;
    r = mannwhitneyu.test(a, b)
    return r.p;
}

/*
 * a: overlap size
 * b: gene set size
 * c: data size
 * d: gene collections size
*/
function _fe(a, b, c, d, alternative) {
    var p;
    p = fishersexact.test(a, b, c-a, d-b, alternative)
    return p;
}

function _test(scores, overlapScores, c, t) {
    var tests = [],
        i = t,
        n = overlapScores.length,
        m0 = _median(overlapScores),
        randomScores,
        m1,
        p;
    while (i--) {
        randomScores = _randomScores(scores, n);
        m1 = _median(randomScores);
        if (m0 > m1) {
            p = _mwu(overlapScores, randomScores);
            if (p < c) {
                tests.push(p);
            }
        }
    }
    return Math.max(1 - (tests.length/t), 1/t)
}

self.onmessage = function(e) {
    var t0 = performance.now(),
        geneScores = e.data.geneScores,
        genes = Object.keys(e.data.geneScores),
        scores = _scores(geneScores, Object.keys(e.data.geneScores)),
        sets = e.data.collection,
        c0 = 5,
        c1 = 0.05,
        times = 1000,
        enrichment = [],
        overlap,
        overlapScores,
        result,
        t1;
    for (var set in sets) {
        overlap = _overlap(genes, sets[set]);
        if (overlap.length > c0) {
            overlapScores = _scores(geneScores, overlap);
            result = _test(scores, overlapScores, c1, times);
            enrichment.push({
                geneSet: set,
                overlapSize: overlap.length,
                geneSetSize: sets[set].length,
                percent: Math.round((overlap.length/sets[set].length) * 100),
                pValue: result
            });
        }
    };
    enrichment = enrichment.sort(function(a, b) {
        return a.pValue - b.pValue;
    });
    t1 = performance.now();
    console.log('[enrichmentWorker] Enrichment completed in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage(enrichment);
};
