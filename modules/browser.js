/**
 * Dumb functions
 */
function identity() {
    return () => arguments[0]
}
let noop = () => {}

/**
 * Browser detection
 */
let isBrowser = typeof window !== 'undefined'

/**
 * Browser functions needed by router5
 */
let getBase = () => window.location.pathname.replace(/\/$/, '')

let pushState = (state, title, path) => window.history.pushState(state, title, path)

let replaceState = (state, title, path) => window.history.replaceState(state, title, path)

let addPopstateListener = (fn) => window.addEventListener('popstate', fn)

let removePopstateListener = (fn) => window.removeEventListener('popstate', fn)

let getLocation = (opts) => {
    let path = opts.useHash
        ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '')
        : window.location.pathname.replace(new RegExp('^' + opts.base), '')
    return path + window.location.search;
}

/**
 * Export browser object
 */
let browser = {}
if (isBrowser) {
    browser = {getBase, pushState, replaceState, addPopstateListener, removePopstateListener, getLocation}
} else {
    browser = {
        getBase:                identity(''),
        pushState:              noop,
        replaceState:           noop,
        addPopstateListener:    noop,
        removePopstateListener: noop,
        getLocation:            identity('')
    }
}

export default browser
