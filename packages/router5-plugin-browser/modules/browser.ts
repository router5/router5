import { Browser } from './types'

const value = arg => () => arg
const noop = () => {}

const isBrowser = typeof window !== 'undefined' && window.history

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
    const correctedPath = safelyEncodePath(path)

    return (correctedPath || '/') + window.location.search
}

const safelyEncodePath = path => {
    try {
        return encodeURI(decodeURI(path))
    } catch (_) {
        return path
    }
}

const getState = () => window.history.state

const getHash = () => window.location.hash

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
    browser = {
        getBase: value(''),
        pushState: noop,
        replaceState: noop,
        addPopstateListener: noop,
        getLocation: value(''),
        getState: value(null),
        getHash: value('')
    }
}

export default browser as Browser
