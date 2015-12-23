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
        console.log('[mappingWorker] ' + data.length + ' mappings loaded');
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
        mapping = _generateMapping(),
        scores = {},
        geneScores = {},
        n = 0,
        reader,
        rows,
        cols,
        genes,
        t1;

    // main function to map rows in a BED file
    var mapRows = function(rows) {
        // do the mapping for each row
        rows.forEach(function(row) {
            cols = row.split(/\t/);
            genes = _search(mapping, cols[0], cols[1], cols[2]);
            if (genes.length > 0) {
                // might return multiple genes
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

        console.log('[mappingWorker] ' + rows.length + ' binding events detected');
        console.log('[mappingWorker] ' + n + ' gene level scores collected');
        t1 = performance.now();
        console.log('[mappingWorker] Mapping completed in ' + ((t1 - t0)/1000) + ' seconds');
        self.postMessage(geneScores);
    };

    // read the file
    if (typeof FileReader !== 'undefined') {
        console.log('[mappingWorker] Asynchronous reading...');
        reader = new FileReader();
        reader.onload = function(e) {
            rows = e.target.result.trim().split(/\r?\n/);
            mapRows(rows);
        };
        reader.readAsText(e.data);
    } else {
        // synchronous reader for browsers
        // that don't support async FileReader
        console.log('[mappingWorker] Synchronous reading...');
        reader = new FileReaderSync();
        var content = reader.readAsText(e.data);
        rows = content.trim().split(/\r?\n/);
        mapRows(rows);
    }
};
