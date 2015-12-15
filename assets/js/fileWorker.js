'use strict';

Array.range = function(n) {
    return Array.apply(null,Array(n)).map((x,i) => i)
};

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(n) {
        return Array.range(Math.ceil(this.length/n)).map((x,i) => this.slice(i*n,i*n+n));
    }
});

self.onmessage = function(e) {
    var t0 = performance.now(),
        reader = new FileReader(),
        rows,
        chunks,
        chunkSize,
        t1;

    reader.readAsText(e.data);
    reader.onload = function(e) {
        rows = e.target.result.trim().split(/\r?\n/);
        chunkSize = rows.length/4;
        chunks = rows.chunk(chunkSize);

        console.log('[fileWorker] ' + rows.length + ' binding events collected');
        t1 = performance.now();
        console.log('[fileWorker] File reading completed in ' + ((t1 - t0) / 1000) + ' seconds');
        self.postMessage(chunks);
    };
};
