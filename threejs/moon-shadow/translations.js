// Translations
"use strict";
// globals: document, window, navigator

var ECT = window.ECT || {};

ECT.translations = {};

// English
ECT.translations.en = {
    elements: {

    }
};

// French
ECT.translations.fr = {
    elements: {

    }
};

// Spanish
ECT.translations.es = {
    elements: {}

};

// Portuguese
ECT.translations.pt = {
    elements: {

    }

};

// stop automatic zoom after user changed zoom for first time
window.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
        window.EC.userChangedZoom = true;
    }
}, true);

