'use strict';

importScripts('../libs/mannwhitneyu.js',
              '../libs/fishersexact.js',
              '../libs/stats-javascript.js');

/*
a: list of genes from data
b: list of genes from gene set
*/
function _overlapGenes(a, b) {
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

/*
s: list of scores
n: number of random scores
*/
function _randomScores(s, n) {
    var r = [],
        l = s.length;
    while (n--) r.push(s[Math.floor(Math.random() * l)]);
    return r;
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

/*
 * a: overlap size
 * b: gene set size
 * c: data size
 * d: gene collections size
*/
function _fETest(a, b, c, d) {
    var r;
    r = fishersexact.test(a, b, c-a, d-b, 'greater')
    return r.p;
}

/*
 * a: overlapping set
 * b: random set
*/
function _mwu(a, b) {
    var r;
    r = mannwhitneyu.test(a, b, 'greater')
    return r.p;
}

function _gSETest(scores, overlapScores, c, t) {
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

function _combinePVals(pVals) {
    var r;
    r = stats.combinepvals.fishers(pVals);
    return r.p
}

self.onmessage = function(e) {
    var t0 = new Date().getTime(),
        geneScores = e.data.geneScores,
        genes = Object.keys(e.data.geneScores),
        scores = _scores(geneScores, genes),
        geneCollection = e.data.geneCollection,
        geneCollectionsSize = e.data.geneCollectionsSize,
        c0 = 5,
        c1 = 0.05,
        times = 1000,
        data = [],
        overlapGenes,
        overlapScores,
        fPValue,
        fPValueCorr,
        gSPValue,
        t1;
    // tests for each gene set in the collection
    geneCollection.geneSets.forEach(function(geneSet) {
        // find common genes between data and gene set
        overlapGenes = _overlapGenes(genes, geneSet.genes);
        if (overlapGenes.length > c0) {
            // get scores of overlapping genes
            overlapScores = _scores(geneScores, overlapGenes);
            fPValue = _fETest(overlapGenes.length,
                geneSet.genes.length, genes.length, geneCollectionsSize);
            gSPValue = _gSETest(scores, overlapScores, c1, times);
            data.push({
                geneSet: geneSet.name,
                genes: overlapGenes,
                overlapSize: overlapGenes.length,
                geneSetSize: geneSet.genes.length,
                percent: Math.round((overlapGenes.length/geneSet.genes.length)*100),
                fPValue: fPValue,
                gSPValue: gSPValue
            });
        }
    });
    // correct for functional enrichment p-values
    fPValueCorr = stats.multicomp.bh(data.map(function(r) {
        return r.fPValue;
    }));
    // combine corrected functional enrichment p-values
    // and gene set enrichment p-values
    data = data.map(function(r, i) {
        r.fPValueCorr = fPValueCorr[i];
        r.cPValue = _combinePVals([r.fPValueCorr, r.gSPValue]);
        return r
    });
    // sort by combined p-value in ascending order
    data = data.sort(function(a, b) {
        return a.cPValue - b.cPValue;
    });

    t1 = new Date().getTime();
    console.log([
        '[enrichmentWorker] Enrichment for',
        geneCollection.name,
        'completed in',
        ((t1 - t0) / 1000),
        'seconds'
    ].join(' '));

    self.postMessage({
        id: geneCollection.id,
        title: geneCollection.name,
        data: data
    });
};
