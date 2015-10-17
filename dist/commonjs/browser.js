/**
 * Dumb functions
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var identity = function identity(arg) {
    return function () {
        return arg;
    };
};
var noop = function noop() {};

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

var pushState = function pushState(state, title, path) {
    return window.history.pushState(state, title, path);
};

var replaceState = function replaceState(state, title, path) {
    return window.history.replaceState(state, title, path);
};

var addPopstateListener = function addPopstateListener(fn) {
    return window.addEventListener('popstate', fn);
};

var removePopstateListener = function removePopstateListener(fn) {
    return window.removeEventListener('popstate', fn);
};

var getLocation = function getLocation(opts) {
    var path = opts.useHash ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '') : window.location.pathname.replace(new RegExp('^' + opts.base), '');
    return path + window.location.search;
};

var getState = function getState() {
    return window.history.state;
};

/**
 * Export browser object
 */
var browser = {};
if (isBrowser) {
    browser = { getBase: getBase, pushState: pushState, replaceState: replaceState, addPopstateListener: addPopstateListener, removePopstateListener: removePopstateListener, getLocation: getLocation, getState: getState };
} else {
    browser = {
        getBase: identity(''),
        pushState: noop,
        replaceState: noop,
        addPopstateListener: noop,
        removePopstateListener: noop,
        getLocation: identity(''),
        getState: identity(null)
    };
}

exports['default'] = browser;
module.exports = exports['default'];