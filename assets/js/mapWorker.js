'use strict';

function _generateMapping() {
    var request = new XMLHttpRequest(),
        response = [];
    request.open('GET', '/assets/resources/grch37_hsapiens_gene_ensembl_mapping.json', false);
    request.send(null);
    if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        console.log('[mapWorker] ' + data.length + ' mappings loaded');
        response = data;
    }
    return response;
};

function _search(mapping, chr_name, start, end) {
    var m = mapping,
        c = !chr_name.indexOf('chr') ? chr_name.replace(/chr/g, ''): chr_name,
        s = parseInt(start),
        e = parseInt(end),
        result;
    result = m.filter(function (el) {
                return el.chromosome_name == c &&
                       el.start_position <=  e &&
                       el.end_position >= s;
            });
    return result;
};

self.onmessage = function(e) {
    var t0 = performance.now(),
        rows = e.data,
        mapping = _generateMapping(),
        scores = [],
        cols,
        genes,
        t1;

    rows.forEach(function(row) {
        cols = row.split(/\t/);
        genes = _search(mapping, cols[0], cols[1], cols[2]);
        if (genes.length > 0) {
            genes.forEach(function(gene) {
                scores.push({
                    gene: gene.hgnc_symbol,
                    score: parseFloat(cols[4])
                });
            });
        }
    });

    t1 = performance.now();
    console.log('[mapWorker] Mapping completed in ' + ((t1 - t0)/1000) + ' seconds');
    self.postMessage(scores);
};
