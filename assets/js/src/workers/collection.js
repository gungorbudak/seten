'use strict';

import * as _ from 'lodash';

var development = process.env.NODE_ENV !== 'production';
var resourcesDir = development ? '/assets/resources': '/~sysbio/seten/assets/resources';

function _getSize(colls) {
  var genes = [];
  var size;

  for (var coll in colls) {
    colls[coll].geneSets.forEach(function (geneSet) {
      genes.push(geneSet.genes)
    });
  }
  size = _.uniq(_.flatten(genes)).length;

  return size;
}

function _getCollection(organism, collectionId) {
  var request = new XMLHttpRequest();
  var collection = {};

  request.open(
    'GET',
    resourcesDir + '/collections/' +
      organism.split('_')[0] + '/' + collectionId + '.json',
    false
  );
  request.send(null);
  if (request.status === 200) {
    collection = JSON.parse(request.responseText)
  }

  return collection;
}

onmessage = function(e) {
  var t0 = new Date().getTime();
  var organism = e.data.organism;
  var inputCollections = e.data.collections;
  var collections = {
    collections: {},
    size: 0
  };
  var t1;

  // get collection for each collection available for given organism
  inputCollections.forEach(function(c) {
    if (_.indexOf(c.organisms, organism) !== -1) {
      collections.collections[c.id] = _getCollection(organism, c.id);
    }
  });

  // size of all collections given organism
  collections.size = _getSize(collections.collections);

  t1 = new Date().getTime();
  console.log('[collectionWorker] ' + collections.size + ' unique genes collected from gene set collections in ' + ((t1 - t0) / 1000) + ' seconds');
  postMessage(collections);
};
