import constants, { errorCodes }  from '../constants';
import { noop } from '../utils';

export default function withRouterLifecycle(router) {
    let started = false;
    const options = router.getOptions();

    router.isStarted = isStarted;
    router.start = start;
    router.stop = stop;

    function isStarted() {
        return started;
    }

    function start(...args) {
        const lastArg = args.slice(-1)[0];
        const done = (lastArg instanceof Function) ? lastArg : noop;
        let startPath, startState;

        if (started) {
            done({ code: errorCodes.ROUTER_ALREADY_STARTED });
            return router;
        }

        started = true;
        router.invokeListeners(constants.ROUTER_START);

        if (args.length > 0) {
            if (typeof args[0] === 'string') startPath = args[0];
            if (typeof args[0] === 'object') startState = args[0];
        }

        // callback
        const cb = (err, state, invokeErrCb = true) => {
            if (!err) router.invokeListeners(constants.TRANSITION_SUCCESS, state, null, {replace: true});
            if (err && invokeErrCb) router.invokeListeners(constants.TRANSITION_ERROR, state, null, err);
            done(err, state);
        };

        // Get start path
        if (startPath === undefined && startState === undefined && router.getLocation) {
            startPath = router.getLocation();
        }

        if (!startState) {
            // If no supplied start state, get start state
            startState = startPath === undefined ? null : router.matchPath(startPath);
            // Navigate to default function
            const navigateToDefault = () => router.navigateToDefault({replace: true}, done);
            const redirect = (route) => router.navigate(route.name, route.params, {replace: true, reload: true}, done);
            // If matched start path
            if (startState) {
                router.transitionToState(startState, router.getState(), {}, (err, state) => {
                    if (!err) cb(null, state);
                    else if (err.redirect) redirect(err.redirect);
                    else if (options.defaultRoute) navigateToDefault();
                    else cb(err, null, false);
                });
            } else if (options.defaultRoute) {
                // If default, navigate to default
                navigateToDefault();
            } else if (options.allowNotFound) {
                cb(null, router.makeNotFoundState(startPath));
            } else {
                // No start match, no default => do nothing
                cb({ code: errorCodes.ROUTE_NOT_FOUND, path: startPath }, null);
            }
        } else {
            // Initialise router with provided start state
            router.setState(startState);
            done(null, startState);
        }

        return router;
    }

    function stop() {
        if (started) {
            router.setState(null);
            started = false;
            router.invokeListeners(constants.ROUTER_STOP);
        }

        return router;
    }
}
