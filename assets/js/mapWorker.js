'use strict';

function _computeGeneScore(scores, method) {
    var m = typeof method !== 'undefined' ? method: 'highest';
    if (m == 'highest') {
        return Math.max.apply(null, scores)
    }
};

function _generateMapping() {
    var request = new XMLHttpRequest(),
        mapping = {};
    request.open('GET', '/assets/resources/grch37_hsapiens_gene_ensembl_mapping.json', false);
    request.send(null);
    if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        data.forEach(function(d) {
            if (!mapping.hasOwnProperty(d.chromosome_name)) {
                mapping[d.chromosome_name] = []
            }
            mapping[d.chromosome_name].push(d)
        });
        console.log('[mapWorker] ' + data.length + ' mappings loaded');
    }
    return mapping;
};

function _search(mapping, chr_name, start, end) {
    var m = mapping,
        c = chr_name.toUpperCase(),
        s = parseInt(start),
        e = parseInt(end),
        result;

    // fix chromosome namings
    if (!c.indexOf('CHR')) {
        c = c.replace(/CHR/g, '');
    }
    if (c == 'M') {
        c = 'MT';
    }

    try {
        result = m[c].filter(function (el) {
            return el.start_position < e &&
                   el.end_position > s;
        });
    } catch (e) {
        console.log(e);
    }

    return result;
};

self.onmessage = function(e) {
    var t0 = performance.now(),
        rows = e.data,
        mapping = _generateMapping(),
        scores = {},
        geneScores = {},
        n = 0,
        cols,
        genes,
        t1;

    rows.forEach(function(row) {
        cols = row.split(/\t/);
        genes = _search(mapping, cols[0], cols[1], cols[2]);
        if (genes.length > 0) {
            genes.forEach(function(gene) {
                if (!scores.hasOwnProperty(gene.hgnc_symbol)) {
                    scores[gene.hgnc_symbol] = [];
                }
                scores[gene.hgnc_symbol].push(parseFloat(cols[4]));
            });
        }
    });

    // compute gene level scores
    for (var gene in scores) {
        geneScores[gene] = _computeGeneScore(scores[gene]);
        n++;
    }

    console.log('[mapWorker] ' + n + ' gene level scores collected');
    t1 = performance.now();
    console.log('[mapWorker] Mapping completed in ' + ((t1 - t0)/1000) + ' seconds');
    self.postMessage(geneScores);
};
