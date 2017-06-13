(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('router5BrowserPlugin', factory) :
	(global.router5BrowserPlugin = factory());
}(this, (function () { 'use strict';

var errorCodes = {
    ROUTER_NOT_STARTED: 'NOT_STARTED',
    NO_START_PATH_OR_STATE: 'NO_START_PATH_OR_STATE',
    ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
    SAME_STATES: 'SAME_STATES',
    CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
    CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
    TRANSITION_ERR: 'TRANSITION_ERR',
    TRANSITION_CANCELLED: 'CANCELLED'
};

var constants = {
    UNKNOWN_ROUTE: '@@router5/UNKNOWN_ROUTE',
    ROUTER_START: '$start',
    ROUTER_STOP: '$stop',
    TRANSITION_START: '$$start',
    TRANSITION_CANCEL: '$$cancel',
    TRANSITION_SUCCESS: '$$success',
    TRANSITION_ERROR: '$$error'
};

/**
 * Dumb functions
 */
// istanbul ignore next
var identity = function identity(arg) {
    return function () {
        return arg;
    };
};
// istanbul ignore next
var noop = function noop() {};

/**
 * Browser detection
 */
var isBrowser = typeof window !== 'undefined' && window.history;

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
    return (path || '/') + window.location.search;
};

var getState = function getState() {
    return window.history.state;
};

var getHash = function getHash() {
    return window.location.hash;
};

/**
 * Export browser object
 */
var browser = {};
if (isBrowser) {
    browser = { getBase: getBase, pushState: pushState, replaceState: replaceState, addPopstateListener: addPopstateListener, removePopstateListener: removePopstateListener, getLocation: getLocation, getState: getState, getHash: getHash };
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
    };
}

var safeBrowser = browser;

function withUtils(router, options) {
    router.urlToPath = urlToPath;
    router.buildUrl = buildUrl;
    router.matchUrl = matchUrl;

    function buildUrl(route, params) {
        var base = options.base || '';
        var prefix = options.useHash ? '#' + options.hashPrefix : '';
        var path = router.buildPath(route, params);

        return base + prefix + path;
    }

    function urlToPath(url) {
        var match = url.match(/^(?:http|https)\:\/\/(?:[0-9a-z_\-\.\:]+?)(?=\/)(.*)$/);
        var path = match ? match[1] : url;

        var pathParts = path.match(/^(.+?)(#.+?)?(\?.+)?$/);

        if (!pathParts) throw new Error('[router5] Could not parse url ' + url);

        var pathname = pathParts[1];
        var hash = pathParts[2] || '';
        var search = pathParts[3] || '';

        return (options.useHash ? hash.replace(new RegExp('^#' + options.hashPrefix), '') : options.base ? pathname.replace(new RegExp('^' + options.base), '') : pathname) + search;
    }

    function matchUrl(url) {
        return router.matchPath(urlToPath(url));
    }
}

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var defaultOptions = {
    forceDeactivate: true,
    useHash: false,
    hashPrefix: '',
    base: false,
    mergeState: false,
    preserveHash: false
};

var source = 'popstate';

function browserPluginFactory() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var browser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : safeBrowser;

    var options = _extends({}, defaultOptions, opts);
    var transitionOptions = { forceDeactivate: options.forceDeactivate, source: source };

    function browserPlugin(router) {
        var routerOptions = router.getOptions();
        var routerStart = router.start;

        withUtils(router, options);

        router.start = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (args.length === 0 || typeof args[0] === 'function') {
                routerStart.apply(undefined, [browser.getLocation(options)].concat(args));
            } else {
                routerStart.apply(undefined, args);
            }

            return router;
        };

        router.replaceHistoryState = function (name) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var state = router.buildState(name, params);
            var url = router.buildUrl(name, params);
            router.lastKnownState = state;
            browser.replaceState(state, '', url);
        };

        function updateBrowserState(state, url, replace) {
            var finalState = options.mergeState === true ? _extends({}, browser.getState(), state) : state;
            if (replace) browser.replaceState(finalState, '', url);else browser.pushState(finalState, '', url);
        }

        function onPopState(evt) {
            var routerState = router.getState();
            // Do nothing if no state or if last know state is poped state (it should never happen)
            var newState = !evt.state || !evt.state.name;
            var state = newState ? router.matchPath(browser.getLocation(options), source) : evt.state;
            var defaultRoute = routerOptions.defaultRoute,
                defaultParams = routerOptions.defaultParams;


            if (!state) {
                // If current state is already the default route, we will have a double entry
                // Navigating back and forth will emit SAME_STATES error
                defaultRoute && router.navigateToDefault(_extends({}, transitionOptions, { reload: true, replace: true }));
                return;
            }
            if (routerState && router.areStatesEqual(state, routerState, false)) {
                return;
            }

            router.transitionToState(state, routerState, transitionOptions, function (err, toState) {
                if (err) {
                    if (err.redirect) {
                        var _err$redirect = err.redirect,
                            name = _err$redirect.name,
                            params = _err$redirect.params;


                        router.navigate(name, params, _extends({}, transitionOptions, { replace: true }));
                    } else if (err === errorCodes.CANNOT_DEACTIVATE) {
                        var url = router.buildUrl(routerState.name, routerState.params);
                        if (!newState) {
                            // Keep history state unchanged but use current URL
                            updateBrowserState(state, url, true);
                        }
                        // else do nothing or history will be messed up
                        // TODO: history.back()?
                    } else {
                        // Force navigation to default state
                        defaultRoute && router.navigate(defaultRoute, defaultParams, _extends({}, transitionOptions, { reload: true, replace: true }));
                    }
                } else {
                    router.invokeEventListeners(constants.TRANSITION_SUCCESS, toState, routerState, { replace: true });
                }
            });
        }

        function onStart() {
            if (options.useHash && !options.base) {
                // Guess base
                options.base = browser.getBase();
            }

            browser.addPopstateListener(onPopState);
        }

        function onStop() {
            browser.removePopstateListener(onPopState);
        }

        function onTransitionSuccess(toState, fromState, opts) {
            var historyState = browser.getState();
            var replace = opts.replace || fromState && router.areStatesEqual(toState, fromState, false) || opts.reload && historyState && router.areStatesEqual(toState, historyState, false);
            var url = router.buildUrl(toState.name, toState.params);
            if (fromState === null && options.preserveHash === true) {
                url += browser.getHash();
            }
            updateBrowserState(toState, url, replace);
        }

        return { onStart: onStart, onStop: onStop, onTransitionSuccess: onTransitionSuccess, onPopState: onPopState };
    }

    browserPlugin.pluginName = 'BROWSER_PLUGIN';

    return browserPlugin;
}

return browserPluginFactory;

})));
