'use strict';

var development = process.env.NODE_ENV !== 'production';
var resourcesDir = development ?
  '/assets/resources': '/seten/assets/resources';

function getSample(sampleId) {
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
  sample = getSample(sampleId);

  t1 = new Date().getTime();
  console.log('[sampleWorker] Got ' + sampleId + ' in ' + ((t1 - t0) / 1000) + ' seconds');
  postMessage({
    file: sample,
    fileName: sampleId + '.bed'
  });
};
