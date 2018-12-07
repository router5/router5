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

const addPopstateListener = (fn, opts) => {
    const shouldAddHashChangeListener =
        opts.useHash && !supportsPopStateOnHashChange()

    window.addEventListener('popstate', fn)

    if (shouldAddHashChangeListener) {
        window.addEventListener('hashchange', fn)
    }

    return () => {
        window.removeEventListener('popstate', fn)

        if (shouldAddHashChangeListener) {
            window.removeEventListener('hashchange', fn)
        }
    }
}

const getLocation = opts => {
    const path = opts.useHash
        ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '')
        : window.location.pathname.replace(new RegExp('^' + opts.base), '')

    // Fix issue with browsers that don't URL encode characters (Edge)
    const correctedPath = encodeURI(decodeURI(path))

    return (correctedPath || '/') + window.location.search
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
        getLocation: identity(''),
        getState: identity(null),
        getHash: identity('')
    }
}

export default browser
