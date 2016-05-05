'use strict';

importScripts('../libs/jstat.js');

var development = process.env.NODE_ENV !== 'production';
var resourcesDir = development ?
  '/assets/resources': '/~sysbio/seten/assets/resources';

/*
Function to compute gene level score from multiple scores
of the same gene with several options
*/
function getGeneScore(scores, method) {
  if (scores.length == 1) {
    return scores[0];
  }
  var m = typeof method !== 'undefined' ? method: 'max';
  if (m == 'max') {
    return jStat.max(scores);
  } else if (m == 'mean') {
    return jStat.mean(scores);
  }  else if (m == 'median') {
    return jStat.median(scores);
  } else if (m == 'min') {
    return jStat.min(scores);
  }  else if (m == 'sum') {
    return jStat.sum(scores);
  }
};

/*
Reading and parsing mapping file for searching for genes
*/
function getMapping(organism) {
  var request = new XMLHttpRequest();
  var mapping = {};
  var c = 0;

  request.open('GET',
         resourcesDir + '/mappings/' + organism + '.json',
         false);
  request.send(null);
  if (request.status === 200) {
    var data = JSON.parse(request.responseText);
    data.forEach(function(d) {
      // check if the symbol is available
      if (d.symbol != '') {
        if (!mapping.hasOwnProperty(d.chrName)) {
          mapping[d.chrName] = [];
        }
        mapping[d.chrName].push(d);
        c++;
      }
    });
    console.log('[mappingWorker] Got ' + c + ' mappings');
  }

  return mapping;
};

/*
Searching for genes using their coordinates on the chromosomes
*/
function getGenes(mapping, chrName, start, end) {
  var m = mapping;
  var c = chrName.toUpperCase();
  var s = parseInt(start);
  var e = parseInt(end);
  var result = [];

  // fix chromosome namings
  if (!c.indexOf('CHR')) {
    c = c.replace(/CHR/g, '');
  }
  if (c == 'M') {
    c = 'MT';
  }

  if (m.hasOwnProperty(c)) {
    result = m[c].filter(function (el) {
      return el.start < e && el.end > s;
    });
  }

  return result;
};

/*
Parser for BED file
*/
function getScoresFromFileBedFile(rows, organism) {
  var mapping = getMapping(organism);
  var scores = {};
  var cols;
  var genes;

  // do the mapping for each row
  rows.forEach(function(row) {
    cols = row.split(/\s/);
    genes = getGenes(mapping, cols[0], cols[1], cols[2]);
    if (genes.length > 0) {
      // might return multiple genes
      genes.forEach(function(gene) {
        // make a list for a new gene symbol
        if (!scores.hasOwnProperty(gene.symbol)) {
          scores[gene.symbol] = [];
        }
        // append the score to the gene symbol's list
        scores[gene.symbol].push(parseFloat(cols[4]));
      });
    }
  });

  return scores;
};

/*
Parser for two column gene - score pair file
*/
function getScoresFromTwoColumnFile(rows) {
  var scores = {};
  var cols;

  rows.forEach(function(row) {
    cols = row.split(/\s/);
    // make a list for a new gene symbol
    if (!scores.hasOwnProperty(cols[0])) {
      scores[cols[0]] = [];
    }
    // append the score to the gene symbol's list
    scores[cols[0]].push(parseFloat(cols[1]));
  });

  return scores;
}

onmessage = function(e) {
  var t0 = new Date().getTime();
  var organism = e.data.organism;
  var reader;
  var t1;

  // read the file
  if (typeof FileReader !== 'undefined') {
    reader = new FileReader();
    reader.onload = function(e) {
      getGeneScores(e.target.result, organism);
    };
    reader.readAsText(e.data.file);
  } else {
    // synchronous reader for browsers
    // that don't support async FileReader
    reader = new FileReaderSync();
    var content = reader.readAsText(e.data.file);
    getGeneScores(content, organism);
  }

  // main function to map content of the input file
  var getGeneScores = function(content, organism) {
    var rows = content.trim().split(/\r?\n/);
    var colSize = rows[0].split(/\s/).length;
    var geneScores = [];
    var scores;

    // get scores according to number of columns
    // in the first row of the file
    if (colSize > 2) {
      scores = getScoresFromFileBedFile(rows, organism);
    } else {
      scores = getScoresFromTwoColumnFile(rows);
    }

    // compute gene level scores
    for (var gene in scores) {
      geneScores.push({
        gene: gene,
        score: getGeneScore(scores[gene])
      });
    }

    if (colSize > 2) {
      console.log('[mappingWorker] Got ' + rows.length + ' binding events');
    }
    console.log('[mappingWorker] Got ' + geneScores.length + ' gene level scores');
    t1 = new Date().getTime();
    console.log('[mappingWorker] Did mapping in ' + ((t1 - t0)/1000) + ' seconds');
    postMessage(geneScores);
  };
};
