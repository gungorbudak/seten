'use strict';

var development = process.env.NODE_ENV !== 'production';
var resourcesDir = development ? '/assets/resources': '/~sysbio/seten/assets/resources';

function _getSample(sampleId) {
  var request = new XMLHttpRequest();
  var blob;

  request.open('GET', resourcesDir + '/samples/' + sampleId + '.bed', false);
  request.send(null);
  if (request.status === 200) {
    blob = new Blob([request.responseText], {type: "text/plain"});
  }

  return blob;
}

onmessage = function(e) {
  var t0 = new Date().getTime();
  var sampleId = e.data;
  var sample;
  var t1;

  // get the given sample
  sample = _getSample(sampleId);

  t1 = new Date().getTime();
  console.log('[sampleWorker] ' + sampleId + ' sample collected in ' + ((t1 - t0) / 1000) + ' seconds');
  postMessage({file: sample, name: sampleId + '.bed'});
};
