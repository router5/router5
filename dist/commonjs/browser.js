Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Browser detection
 */
var isBrowser = typeof window !== 'undefined';

/**
 * Browser functions needed by router5
 */
var getBase = function getBase() {
    return window.location.pathname.replace(/\/$/, '');
};

var getLocation = function getLocation(opts) {
    var path = opts.useHash ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '') : window.location.pathname.replace(new RegExp('^' + opts.base), '');
    return path + window.location.search;
};

/**
 * Export browser object
 */
var browser = {};
if (isBrowser) {
    browser = { getBase: getBase, getLocation: getLocation };
} else {
    browser = {
        getBase: function getBase() {
            return '';
        },
        getLocation: function getLocation() {
            return '';
        }
    };
}

exports['default'] = browser;
module.exports = exports['default'];