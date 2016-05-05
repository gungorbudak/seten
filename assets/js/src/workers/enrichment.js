'use strict';

import * as _ from 'lodash';

importScripts('../libs/jstat.js');

/*
 * a: overlap size
 * b: gene set size
 * c: dataset genes size
 * d: gene collections size
*/
function funcEnrichment(a, b, c, d) {
  var r;
  r = jStat.fishersexact(a, b, c-a, d-b);
  return r.p;
}

function geneSetEnrichment(scores, overlapGeneScores, cutoff, times) {
  var tests = [];
  var i = times;
  var overlapScores = _.map(overlapGeneScores, 'score');
  var n = overlapScores.length;
  var m0 = jStat.median(overlapScores);
  var randomScores = [];
  var m1;
  var t;

  while (i--) {
    randomScores = _.sampleSize(scores, n);
    m1 = jStat.median(randomScores);
    if (m0 > m1) {
      t = jStat.mannwhitneyu(overlapScores, randomScores);
      if (t.p < cutoff) {
        tests.push(t.p);
      }
    }
  }

  return Math.max(1 - (tests.length/times), 1/times);
}

onmessage = function(e) {
  var t0 = new Date().getTime();
  var geneScores = e.data.geneScores;
  var genes = _.map(geneScores, 'gene');
  var scores = _.map(geneScores, 'score');
  var genesSize = genes.length;
  var geneSetCollection = e.data.geneSetCollection;
  var geneSetCollectionsSize = e.data.geneSetCollectionsSize;
  var enrichmentMethod = e.data.enrichmentMethod;
  // var correctionMethod = e.data.correctionMethod;
  var geneSetCutoff = e.data.geneSetCutoff;
  var overlapCutoff = e.data.overlapCutoff;
  var significanceCutoff = e.data.significanceCutoff;
  var numberOfIterations = e.data.numberOfIterations;
  var data = [];
  var geneSetSize;
  var overlapGeneScores;
  var overlapGeneScoresSize;
  var fPValue;
  var fPValueCorr;
  var gSPValue;
  var t1;

  // tests for each gene set in the collection
  geneSetCollection.geneSets.forEach(function(geneSet) {
    geneSetSize = geneSet.size;
    // if there are less number of genes in gene set than given value
    if (geneSetSize <= geneSetCutoff) {
      // find common genes between data and gene set
      overlapGeneScores = _.filter(geneScores, function(geneScore) {
        return _.indexOf(geneSet.genes, geneScore.gene) !== -1;
      });
      // size of the overlap gene scores
      overlapGeneScoresSize = overlapGeneScores.length;
      // check if there is enough number of overlapping genes
      if (overlapCutoff <= overlapGeneScoresSize) {
        // which enrichment method?
        if (enrichmentMethod == 'fe') {
          // compute functional enrichment p-value
          fPValue = funcEnrichment(
            overlapGeneScoresSize,
            geneSetSize,
            genesSize,
            geneSetCollectionsSize
          );
        } else {
          // compute gene set enrichment p-value
          gSPValue = geneSetEnrichment(
            scores,
            overlapGeneScores,
            significanceCutoff,
            numberOfIterations
          );
        }
        // push the result to the data list
        data.push({
          geneSetId: geneSet.id,
          geneSet: geneSet.name,
          genes: _.map(overlapGeneScores, 'gene'),
          geneScores: _.sortBy(overlapGeneScores, 'score').reverse(),
          overlapSize: overlapGeneScoresSize,
          geneSetSize: geneSetSize,
          percent: Math.round((overlapGeneScoresSize / geneSetSize) * 100),
          fPValue: fPValue,
          gSPValue: gSPValue
        });
      }
    }
  });

  if (enrichmentMethod == 'fe') {
    // correct for functional enrichment p-values
    fPValueCorr = jStat.multicomp.bh(data.map(function(r) {
      return r.fPValue;
    }));
    // add p-values to the data
    data = data.map(function(d, i) {
      d.fPValueCorr = fPValueCorr[i];
      return d;
    });
  }

  t1 = new Date().getTime();
  console.log([
    '[enrichmentWorker] Enrichment for',
    geneSetCollection.collection,
    'completed in',
    ((t1 - t0) / 1000),
    'seconds'
  ].join(' '));

  postMessage({
    id: geneSetCollection.collectionId,
    title: geneSetCollection.collection,
    data: data
  });
};
