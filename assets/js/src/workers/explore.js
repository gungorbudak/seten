'use strict';

import * as _ from 'lodash';


var development = process.env.NODE_ENV !== 'production';
var resourcesDir = development ?
  '/assets/resources': '/seten/assets/resources';


function getResultColletionRows(name, collection_id, enrichmentMethod) {
  var request = new XMLHttpRequest();
  var rows = {};
  var _rows;
  var _cols;

  request.open('GET',
               resourcesDir + '/explore/' +
                 name + '-' + collection_id + '-' + enrichmentMethod +  '.tsv',
               false);
  request.send(null);
  if (request.status === 200) {
    _rows = request.responseText.trim().split(/\r?\n/);
    // get rid of the header line
    _rows.shift();
    _rows.forEach(function (row) {
      // split the row by Tab
      _cols = row.split(/\t/);
      // make an object for the row
      rows[_cols[0]] = {
        geneSetId: _cols[0],
        geneSet: _cols[1],
        genes: _cols[2].split(', '),
        geneScores: null,
        overlapSize: parseInt(_cols[3]),
        geneSetSize: parseInt(_cols[4]),
        percent: parseInt(_cols[5])
      };
      // add the p-values according to the enrichment method
      if (enrichmentMethod == 'gse') {
        rows[_cols[0]]['gSPValue'] = parseFloat(_cols[6]);
      } else {
        rows[_cols[0]]['fPValue'] = parseFloat(_cols[6]);
        rows[_cols[0]]['fPValueCorr'] = parseFloat(_cols[7]);
      }
    });
    return rows;
  }

  return null;
}


function getResultCollection(name, collection_id) {
  var gSRows = getResultColletionRows(name, collection_id, 'gse');
  var fRows = getResultColletionRows(name, collection_id, 'fe');
  var data = [];

  if (gSRows !== null || fRows !== null) {
    data = _.values(_.merge(gSRows, fRows));
  }
  return data;
}


function getResult(resultId, collections) {
  var result = resultId.split('-');
  var name = [result[0], result.slice(1, result.length).join('-')].join('/');
  var result = {
    id: resultId,
    collections: []
  };
  var data;

  collections.forEach(function (collection) {

    data = getResultCollection(name, collection.id);
    if (data.length > 0) {
      result.collections.push({
        id: collection.id,
        title: collection.name,
        data: data
      });
    }
  });

  return result;
}


onmessage = function(e) {
  var t0 = new Date().getTime();
  var resultId = e.data.resultId;
  var collections = e.data.collections;
  var result;
  var t1;

  result = getResult(resultId, collections);

  console.log([
    '[exploreWorker] Got results for',
    result.collections.length,
    'gene set collection(s)'
  ].join(' '));
  t1 = new Date().getTime();
  console.log('[exploreWorker] Done in ' + ((t1 - t0) / 1000) + ' seconds');
  postMessage(result);
};
