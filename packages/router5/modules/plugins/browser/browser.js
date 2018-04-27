/**
 * Dumb functions
 */
// istanbul ignore next
const identity = arg => () => arg
// istanbul ignore next
const noop = () => {}

/**
 * Browser detection
 */
const isBrowser = typeof window !== 'undefined' && window.history

/**
 * Browser functions needed by router5
 */
const getBase = () => window.location.pathname

const supportsPopStateOnHashChange = () =>
    window.navigator.userAgent.indexOf('Trident') === -1

const pushState = (state, title, path) =>
    window.history.pushState(state, title, path)

const replaceState = (state, title, path) =>
    window.history.replaceState(state, title, path)

const addPopstateListener = fn => {
    window.addEventListener('popstate', fn)

    if (!supportsPopStateOnHashChange()) {
        window.addEventListener('hashchange', fn)
    }
}

const removePopstateListener = fn => {
    window.removeEventListener('popstate', fn)

    if (!supportsPopStateOnHashChange()) {
        window.removeEventListener('hashchange', fn)
    }
}

const getLocation = opts => {
    const path = opts.useHash
        ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '')
        : window.location.pathname.replace(new RegExp('^' + opts.base), '')
    return (path || '/') + window.location.search
}

const getState = () => window.history.state

const getHash = () => window.location.hash

/**
 * Export browser object
 */
let browser = {}
if (isBrowser) {
    browser = {
        getBase,
        pushState,
        replaceState,
        addPopstateListener,
        removePopstateListener,
        getLocation,
        getState,
        getHash
    }
} else {
    // istanbul ignore next
    browser = {
        getBase: identity(''),
        pushState: noop,
        replaceState: noop,
        addPopstateListener: noop,
        removePopstateListener: noop,
        getLocation: identity(''),
        getState: identity(null),
        getHash: identity('')
    }
}

export default browser
