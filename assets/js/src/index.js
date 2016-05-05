'use strict';

/*
* Seten source code for web-based user interface
* Author: Gungor Budak
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import { explore } from './data/explore';
import { samples } from './data/samples';
import { organisms } from './data/organisms';
import { collections } from './data/collections';
import { enrichmentMethods } from './data/enrichment-methods';
import { scoringMethods } from './data/scoring-methods';
import { correctionMethods } from './data/correction-methods';

// polyfill for browsers lacking log10 method
Math.log10 = Math.log10 || function(x) {
  return Math.log(x) / Math.LN10;
};

// render the application inside .container-app in index.html
ReactDOM.render(
  <App
    explore={explore}
    samples={samples}
    organisms={organisms}
    collections={collections}
    enrichmentMethods={enrichmentMethods}
    scoringMethods={scoringMethods}
    correctionMethods={correctionMethods}
    />,
  document.querySelector('.container-app')
);
