/**
 * Browser detection
 */
let isBrowser = typeof window !== 'undefined';

/**
 * Browser functions needed by router5
 */
let getBase = () => window.location.pathname.replace(/\/$/, '');

let getLocation = (opts) => {
    let path = opts.useHash
        ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '')
        : window.location.pathname.replace(new RegExp('^' + opts.base), '');
    return path + window.location.search;
};

/**
 * Export browser object
 */
let browser = {};
if (isBrowser) {
    browser = {getBase, getLocation};
} else {
    browser = {
        getBase:       () => '',
        getLocation:   () => ''
    };
}

export default browser;
