'use strict';

self.onmessage = function(e) {
    var t0 = performance.now(),
        reader = new FileReader(),
        rows,
        t1;

    reader.readAsText(e.data);
    reader.onload = function(e) {
        rows = e.target.result.trim().split(/\r?\n/);
        
        console.log('[fileWorker] ' + rows.length + ' binding events collected');
        t1 = performance.now();
        console.log('[fileWorker] File reading completed in ' + ((t1 - t0) / 1000) + ' seconds');
        self.postMessage(rows);
    };
};
