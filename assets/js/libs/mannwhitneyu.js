'use strict';

(function(exports) {

    /*
     * standart and fractional functions adapted from rank.js
     * The MIT License, Copyright (c) 2014 Ben Magyar
     */
    // Standard Ranking
    var standard = function(array, key) {
        // sort the array
        array = array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        // assign a naive ranking
        for (var i = 1; i < array.length + 1; i++) {
            array[i - 1]['rank'] = i;
        }
        return array;
    }

    // Fractional Ranking
    // A faster way exists but this works for now
    var fractional = function(array, key) {
        array = standard(array, key);
        // now apply fractional
        var pos = 0;
        while (pos < array.length) {
            var sum = 0;
            var i = 0;
            for (i = 0; array[pos + i + 1] && (array[pos + i][key] === array[pos + i + 1][key]); i++) {
                sum += array[pos + i]['rank'];
            }
            sum += array[pos + i]['rank'];
            var endPos = pos + i + 1;
            for (pos; pos < endPos; pos++) {
                array[pos]['rank'] = sum / (i + 1);
            }
            pos = endPos;
        }
        return array;
    }

    /*
    * erf and dnorm functions adapted from jstat.js
    * The MIT License, Copyright (c) 2013 jStat
    */
    var erf = function erf(x) {
        var cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2, -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
            4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
            1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
            6.529054439e-9, 5.059343495e-9, -9.91364156e-10, -2.27365122e-10, 9.6467911e-11, 2.394038e-12, -6.886027e-12, 8.94487e-13, 3.13092e-13, -1.12708e-13, 3.81e-16, 7.106e-15, -1.523e-15, -9.4e-17, 1.21e-16, -2.8e-17
        ];
        var j = cof.length - 1;
        var isneg = false;
        var d = 0;
        var dd = 0;
        var t, ty, tmp, res;

        if (x < 0) {
            x = -x;
            isneg = true;
        }

        t = 2 / (2 + x);
        ty = 4 * t - 2;

        for (; j > 0; j--) {
            tmp = d;
            d = ty * d - dd + cof[j];
            dd = tmp;
        }

        res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
        return isneg ? res - 1 : 1 - res;
    };

    var dnorm = function(x, mean, std) {
        return 0.5 * (1 + erf((x - mean) / Math.sqrt(2 * std * std)));
    }

    var rank = function(x, y) {
        var nx = x.length,
            ny = y.length,
            combined = [],
            ranked;
        while (nx--) {
            combined.push({
                set: 'x',
                val: x[nx]
            });
        }
        while (ny--) {
            combined.push({
                set: 'y',
                val: y[ny]
            });
        }
        ranked = fractional(combined, 'val');
        return ranked
    };

    var statistic = function(x, y) {
        var ranked = rank(x, y),
            nr = ranked.length,
            nx = x.length,
            ny = y.length,
            ranksums = {
                x: 0,
                y: 0
            };
        while (nr--) {
            ranksums[ranked[nr].set] += ranked[nr].rank
        }
        return Math.min(ranksums.x - (nx*(nx+1)/2), ranksums.y - (ny*(ny+1)/2));
    }

    exports.test = function(x, y) {
        var nx = x.length, // x's size
            ny = y.length; // y's size

        // test statistic
        var u = statistic(x, y);
        // normal approximation
        var mu = nx * ny / 2;
        var std = Math.sqrt(nx * ny * (nx + ny + 1) / 12);
        var z = (u - mu) / std;
        var p = Math.min(dnorm(z, 0, 1) * 2, 1);

        return {U: u, p: p};
    }

})(typeof exports === 'undefined' ? this['mannwhitneyu'] = {} : exports);
