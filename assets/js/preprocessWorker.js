'use strict';

function _computeGeneScore(scores, method) {
    var m = typeof method !== 'undefined' ? method: 'highest';
    if (m === 'highest') {
        return Math.max.apply(null, scores)
    }
};

self.onmessage = function(e) {
    var t0 = performance.now(),
        chunks = e.data,
        scores = [],
        geneScores = {},
        n = 0,
        t1;

    chunks.forEach(function(chunk) {
        chunk.forEach(function(binding) {
            try {
                scores[binding.gene].push(binding.score);
            } catch (e) {
                scores[binding.gene] = [binding.score];
            }
        });
    });

    for (var gene in scores) {
        if (scores[gene].length > 1) {
            geneScores[gene] = _computeGeneScore(scores[gene]);
        } else {
            geneScores[gene] = scores[gene][0];
        }
        n++;
    }

    console.log('[preprocessWorker] ' + n + ' gene level scores collected');
    t1 = performance.now();
    console.log('[preprocessWorker] Proprocessing completed in ' + ((t1 - t0)/1000) + ' seconds');
    self.postMessage(geneScores);
}
