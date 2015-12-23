'use strict';

function _collectSample(filename) {
    var request = new XMLHttpRequest(),
        sample,
        blob;
    request.open('GET', '/assets/resources/samples/' + filename + '.bed', false);
    request.send(null);
    if (request.status === 200) {
        sample = request.responseText;
        blob = new Blob([sample], { type: "text/plain" });
    }
    return blob;
}

self.onmessage = function(e) {
    var t0 = new Date().getTime(),
        sampleName = e.data,
        sample,
        t1;
    sample = _collectSample(sampleName);
    t1 = new Date().getTime();
    console.log('[sampleWorker] ' + sampleName + ' sample collected in ' + ((t1 - t0) / 1000) + ' seconds');
    self.postMessage({file: sample, name: sampleName + '.bed'});
};
