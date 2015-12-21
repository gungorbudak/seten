'use strict';

(function(exports) {

    /*
     * this file is adapted from (c) Øyvind Langsrud's
     * implementation on http://lh3lh3.users.sourceforge.net/fisher.shtml
     */

    function lngamm(z) {
        // Reference: "Lanczos, C. 'A precision approximation
        // of the gamma function', J. SIAM Numer. Anal., B, 1, 86-96, 1964."
        // Translation of  Alan Miller's FORTRAN-implementation
        // See http://lib.stat.cmu.edu/apstat/245
        var x = 0;
        x += 0.1659470187408462e-06 / (z + 7);
        x += 0.9934937113930748e-05 / (z + 6);
        x -= 0.1385710331296526 / (z + 5);
        x += 12.50734324009056 / (z + 4);
        x -= 176.6150291498386 / (z + 3);
        x += 771.3234287757674 / (z + 2);
        x -= 1259.139216722289 / (z + 1);
        x += 676.5203681218835 / (z);
        x += 0.9999999999995183;
        return (Math.log(x) - 5.58106146679532777 - z + (z - 0.5) * Math.log(z + 6.5));
    }

    function lnfact(n) {
        if (n <= 1) return (0);
        return (lngamm(n + 1));
    }

    function lnbico(n, k) {
        return (lnfact(n) - lnfact(k) - lnfact(n - k));
    }

    function hyper_323(n11, n1_, n_1, n) {
        return (Math.exp(lnbico(n1_, n11) + lnbico(n - n1_, n_1 - n11) - lnbico(n, n_1)));
    }

    var sn11, sn1_, sn_1, sn, sprob;

    function hyper(n11) {
        return (hyper0(n11, 0, 0, 0));
    }

    function hyper0(n11i, n1_i, n_1i, ni) {
        if (!(n1_i | n_1i | ni)) {
            if (!(n11i % 10 == 0)) {
                if (n11i == sn11 + 1) {
                    sprob *= ((sn1_ - sn11) / (n11i)) * ((sn_1 - sn11) / (n11i + sn - sn1_ - sn_1));
                    sn11 = n11i;
                    return sprob;
                }
                if (n11i == sn11 - 1) {
                    sprob *= ((sn11) / (sn1_ - n11i)) * ((sn11 + sn - sn1_ - sn_1) / (sn_1 - n11i));
                    sn11 = n11i;
                    return sprob;
                }
            }
            sn11 = n11i;
        } else {
            sn11 = n11i;
            sn1_ = n1_i;
            sn_1 = n_1i;
            sn = ni;
        }
        sprob = hyper_323(sn11, sn1_, sn_1, sn);
        return sprob;
    }

    function exact(n11, n1_, n_1, n) {
        var sleft, sright, sless, slarg;
        var p, i, j, prob;
        var max = n1_;
        if (n_1 < max) max = n_1;
        var min = n1_ + n_1 - n;
        if (min < 0) min = 0;
        if (min == max) {
            sless = 1;
            sright = 1;
            sleft = 1;
            slarg = 1;
            return 1;
        }
        prob = hyper0(n11, n1_, n_1, n);
        sleft = 0;
        p = hyper(min);
        for (i = min + 1; p < 0.99999999 * prob; i++) {
            sleft += p;
            p = hyper(i);
        }
        i--;
        if (p < 1.00000001 * prob) sleft += p;
        else i--;
        sright = 0;
        p = hyper(max);
        for (j = max - 1; p < 0.99999999 * prob; j--) {
            sright += p;
            p = hyper(j);
        }
        j++;
        if (p < 1.00000001 * prob) sright += p;
        else j++;
        if (Math.abs(i - n11) < Math.abs(j - n11)) {
            sless = sleft;
            slarg = 1 - sleft + prob;
        } else {
            sless = 1 - sright + prob;
            slarg = sright;
        }
        return {
            less: sless,
            greater: slarg,
            twoTailed: Math.max(sleft + sright, 1)
        };
    }

    exports.test = function (n11, n12, n21, n22, alternative) {
        var n1_ = n11 + n12,
            n_1 = n11 + n21,
            n = n11 + n12 + n21 + n22,
            r = exact(n11, n1_, n_1, n);

        if (alternative == 'less') {
            return {
                p: r.less
            }
        } else if (alternative == 'greater') {
            return {
                p: r.greater
            }
        } else {
            return {
                p: r.twoTailed
            }
        }
    };

})(typeof exports === 'undefined' ? this['fishersexact'] = {} : exports);
