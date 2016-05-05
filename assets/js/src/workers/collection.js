'use strict';

import * as _ from 'lodash';


var development = process.env.NODE_ENV !== 'production';
var resourcesDir = development ?
  '/assets/resources': '/~sysbio/seten/assets/resources';


function getSize(colls) {
  var genes = [];
  var size;

  for (var coll in colls) {
    colls[coll].geneSets.forEach(function(geneSet) {
      genes.push(geneSet.genes);
    });
  }
  size = _.uniq(_.flatten(genes)).length;

  return size;
}


function getCollection(organism, collectionId) {
  var request = new XMLHttpRequest();
  var organismCode = organism.split('_')[0];
  var collection = {};

  request.open(
    'GET',
    resourcesDir + '/collections/' +
      organismCode + '/' + collectionId + '.json',
    false
  );
  request.send(null);
  if (request.status === 200) {
    collection = JSON.parse(request.responseText);
  }

  return collection;
}


onmessage = function(e) {
  var t0 = new Date().getTime();
  var organism = e.data.organism;
  var inputCollections = e.data.collections;
  var result = {
    collections: {},
    size: 0
  };
  var t1;

  // get collection for each collection available for given organism
  inputCollections.forEach(function(c) {
    if (_.indexOf(c.organisms, organism) !== -1) {
      result.collections[c.id] = getCollection(organism, c.id);
    }
  });

  // size of all collections for given organism (to be used in functional enr.)
  result.size = getSize(result.collections);

  t1 = new Date().getTime();
  console.log([
    '[collectionWorker]',
    result.size,
    'unique genes collected from gene set collections in',
    eval(((t1 - t0) / 1000)),
    'seconds'
  ].join(' '));
  postMessage(result);
};
