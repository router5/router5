import constants, { errorCodes } from '../../constants';
import safeBrowser from './browser';
import withUtils from './utils';

const defaultOptions = {
    forceDeactivate: true,
    useHash: false,
    hashPrefix: '',
    base: false
};

const source = 'popstate';

function browserPluginFactory(opts = {}, browser = safeBrowser) {
    const options = { ...defaultOptions, ...opts };
    const transitionOptions = { forceDeactivate: options.forceDeactivate, source };

    function browserPlugin(router) {
        const routerOptions = router.getOptions();
        const routerStart = router.start;

        withUtils(router, options);

        router.start = function(...args) {
            if (args.length === 0 || typeof args[0] === 'function') {
                routerStart(browser.getLocation(options), ...args);
            } else {
                routerStart(...args);
            }

            return router;
        };

        router.replaceHistoryState = function(name, params = {}) {
            const state = router.buildState(name, params);
            const url = router.buildUrl(name, params);
            router.lastKnownState = state;
            browser.replaceState(state, '', url);
        };


        function updateBrowserState(state, url, replace) {
            if (replace) browser.replaceState(state, '', url);
            else browser.pushState(state, '', url);
        }

        function onPopState(evt) {
            const routerState = router.getState();
            // Do nothing if no state or if last know state is poped state (it should never happen)
            const newState = !evt.state || !evt.state.name;
            const state = newState ? router.matchPath(browser.getLocation(options), source) : evt.state;
            const { defaultRoute, defaultParams } = routerOptions;

            if (!state) {
                // If current state is already the default route, we will have a double entry
                // Navigating back and forth will emit SAME_STATES error
                defaultRoute && router.navigateToDefault({ ...transitionOptions, reload: true, replace: true });
                return;
            }
            if (routerState && router.areStatesEqual(state, routerState, false)) {
                return;
            }

            router.transitionToState(state, routerState, transitionOptions, (err, toState) => {
                if (err) {
                    if (err.redirect) {
                        const { name, params } = err.redirect;

                        router.navigate(name, params, { ...transitionOptions, replace: true });
                    } else if (err === errorCodes.CANNOT_DEACTIVATE) {
                        const url = router.buildUrl(routerState.name, routerState.params);
                        if (!newState) {
                            // Keep history state unchanged but use current URL
                            updateBrowserState(state, url, true);
                        }
                        // else do nothing or history will be messed up
                        // TODO: history.back()?
                    } else {
                        // Force navigation to default state
                        defaultRoute && router.navigate(defaultRoute, defaultParams, { ...transitionOptions, reload: true, replace: true});
                    }
                } else {
                    router.invokeEventListeners(constants.TRANSITION_SUCCESS, toState, routerState, {replace: true});
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
            const historyState = browser.getState();
            const replace = opts.replace || fromState && router.areStatesEqual(toState, fromState, false) ||
                opts.reload && historyState && router.areStatesEqual(toState, historyState, false);
            updateBrowserState(toState, router.buildUrl(toState.name, toState.params) + browser.getHash(), replace);
        }

        return { onStart, onStop, onTransitionSuccess, onPopState };
    };

    browserPlugin.pluginName = 'BROWSER_PLUGIN';

    return browserPlugin;
}

export default browserPluginFactory;
