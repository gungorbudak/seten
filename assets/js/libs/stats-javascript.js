'use strict';

(function(exports) {

    var core = {
        range: function(a, b) {
            var r = [];
            if (a > b) {
                while (a >= b) {
                    r.push(a);
                    a--;
                }
            } else if (a < b) {
                while (a <= b) {
                    r.push(a);
                    a++;
                }
            } else {
                return a;
            }
            return r;
        },
        order: function(arr, d) {
            d = (typeof d !== undefined) ? d : true;
            var r = [];
            var mapped = arr.map(function(el, i) {
                return {
                    i: i + 1,
                    val: el
                };
            });
            mapped.sort(function(a, b) {
                if (d) {
                    if (a.val == b.val) {
                        return b.i - a.i;
                    }
                    return a.val - b.val;
                } else {
                    if (a.val == b.val) {
                        return b.i - a.i;
                    }
                    return b.val - a.val;
                }
            });
            var n = mapped.length;
            while (n--) {
                r.push(mapped[n].i);
            }
            return r;
        },
        cummin: function(arr) {
            var n = arr.length,
                r = [arr[0]];
            for (var i = 1; i < n; i++) {
                if (r[i - 1] > arr[i]) {
                    r.push(arr[i]);
                } else {
                    r.push(r[i - 1]);
                }
            }
            return r;
        },
        pmin: function(min, arr) {
            var n = arr.length,
                r = [];
            for (var i = 0; i < n; i++) {
                if (arr[i] > min) {
                    r.push(min);
                } else {
                    r.push(arr[i]);
                }
            }
            return r;
        },
        /*
        * Log-gamma function
        *
        * Copyright (c) 2013 jStat
        */
        gammaln: function(x) {
            var j = 0;
            var cof = [
                76.18009172947146, -86.50532032941677, 24.01409824083091,
                -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
            ];
            var ser = 1.000000000190015;
            var xx, y, tmp;
            tmp = (y = xx = x) + 5.5;
            tmp -= (xx + 0.5) * Math.log(tmp);
            for (; j < 6; j++)
                ser += cof[j] / ++y;
            return Math.log(2.5066282746310005 * ser / xx) - tmp;
        },
        /*
        * The lower regularized incomplete gamma function
        * usually written P(a,x)
        *
        * Copyright (c) 2013 jStat
        */
        lowRegGamma: function(a, x) {
            var aln = this.gammaln(a);
            var ap = a;
            var sum = 1 / a;
            var del = sum;
            var b = x + 1 - a;
            var c = 1 / 1.0e-30;
            var d = 1 / b;
            var h = d;
            var i = 1;
            // calculate maximum number of itterations required for a
            var ITMAX = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17);
            var an, endval;

            if (x < 0 || a <= 0) {
                return NaN;
            } else if (x < a + 1) {
                for (; i <= ITMAX; i++) {
                    sum += del *= x / ++ap;
                }
                return (sum * Math.exp(-x + a * Math.log(x) - (aln)));
            }

            for (; i <= ITMAX; i++) {
                an = -i * (i - a);
                b += 2;
                d = an * d + b;
                c = b + an / c;
                d = 1 / d;
                h *= d * c;
            }

            return (1 - h * Math.exp(-x + a * Math.log(x) - (aln)));
        },
        /*
        * Upper regularized incomplete gamma function
        *
        * Copyright (c) 2001, 2002 Enthought, Inc.
        * All rights reserved.
        *
        * Copyright (c) 2003-2012 SciPy Developers.
        * All rights reserved.
        *
        * Cephes Math Library Release 2.0:  April, 1987
        * Copyright 1985, 1987 by Stephen L. Moshier
        * Direct inquiries to 30 Frost Street, Cambridge, MA 02140
        */
        uppRegGamma: function(a, x) {
            var MACHEP = 1.38777878078144567553E-17,
                MAXLOG = 8.8029691931113054295988E1,
                big = 4.503599627370496e15,
                biginv = 2.22044604925031308085e-16;

            var ans, ax, c, yc, r, t, y, z;
            var pk, pkm1, pkm2, qk, qkm1, qkm2;

            if ((x < 0) || (a <= 0)) {
                return -1;
            }

            if ((x < 1.0) || (x < a))
	            return 1.0 - this.lowRegGamma(a, x);

            if (!isFinite(x))
                return 0.0;

            ax = a * Math.log(x) - x - this.gammaln(a);
            if (ax < -MAXLOG) {
                return 0.0;
            }
            ax = Math.exp(ax);

            /* continued fraction */
            y = 1.0 - a;
            z = x + y + 1.0;
            c = 0.0;
            pkm2 = 1.0;
            qkm2 = x;
            pkm1 = x + 1.0;
            qkm1 = z * x;
            ans = pkm1 / qkm1;

            do {
                c += 1.0;
                y += 1.0;
                z += 2.0;
                yc = y * c;
                pk = pkm1 * z - pkm2 * yc;
                qk = qkm1 * z - qkm2 * yc;
                if (qk != 0) {
                    r = pk / qk;
                    t = Math.abs((ans - r) / r);
                    ans = r;
                } else {
                    t = 1.0;
                }
                pkm2 = pkm1;
                pkm1 = pk;
                qkm2 = qkm1;
                qkm1 = qk;
                if (Math.abs(pk) > big) {
                    pkm2 *= biginv;
                    pkm1 *= biginv;
                    qkm2 *= biginv;
                    qkm1 *= biginv;
                }
            } while (t > MACHEP);

            return (ans * ax);
        }
    };

    var distributions = {
        chisquare: {
            cdf: function(x, dof) {
                if (x < 0)
                    return 0;
                return core.lowRegGamma(dof / 2, x / 2);
            },
            sf: function(x, dof) {
                if (x < 0)
                    return 1;
                return core.uppRegGamma(dof / 2, x / 2);
            }
        }
    };

    var multicomp = {
        bh: function(p) {
            var n = p.length,
                i = core.range(n, 1),
                o = core.order(p, true),
                ro = core.order(o, false),
                pRaw = [],
                pCorr = [],
                j;
            for (j = 0; j < i.length; j++) {
                pRaw.push(n/i[j] * p[o[j]-1]);
            }
            pRaw = core.pmin(1, core.cummin(pRaw));
            for (j = 0; j < i.length; j++) {
                pCorr.push(pRaw[ro[j]-1]);
            }
            return pCorr;
        }
    };

    var combinepvals = {
        fishers: function(p) {
            var n = p.length,
                pLog = [],
                Xsq,
                pVal;
            for (var i = 0; i < n; i++) {
                pLog.push(Math.log(p[i]));
            }
            Xsq = -2 * pLog.reduce(function(a, b) {
                return a + b;
            });
            pVal = distributions.chisquare.sf(Xsq, 2 * n)
            return {Xsq: Xsq, p: pVal}
        }
    };

    exports.multicomp = multicomp;
    exports.combinepvals = combinepvals;

})(typeof exports === 'undefined' ? this['stats'] = {} : exports);
