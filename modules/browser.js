/**
 * Dumb functions
 */
let identity = arg => () => arg;
let noop = () => {};

/**
 * Browser detection
 */
let isBrowser = typeof window !== 'undefined';

/**
 * Browser functions needed by router5
 */
let getBase = () => window.location.pathname.replace(/\/$/, '');

let pushState = (state, title, path) => window.history.pushState(state, title, path);

let replaceState = (state, title, path) => window.history.replaceState(state, title, path);

let addPopstateListener = (fn) => window.addEventListener('popstate', fn);

let removePopstateListener = (fn) => window.removeEventListener('popstate', fn);

let getLocation = (opts) => {
    let path = opts.useHash
        ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '')
        : window.location.pathname.replace(new RegExp('^' + opts.base), '');
    return path + window.location.search;
}

let getState = () => window.history.state;

/**
 * Export browser object
 */
let browser = {}
if (isBrowser) {
    browser = {getBase, pushState, replaceState, addPopstateListener, removePopstateListener, getLocation, getState};
} else {
    browser = {
        getBase:                identity(''),
        pushState:              noop,
        replaceState:           noop,
        addPopstateListener:    noop,
        removePopstateListener: noop,
        getLocation:            identity(''),
        getState:               identity(null)
    };
}

export default browser;
