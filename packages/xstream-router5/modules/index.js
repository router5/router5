import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import transitionPath from 'router5-transition-path';

const TRANSITION_SUCCESS = '@@router5/TRANSITION_SUCCESS';
const TRANSITION_ERROR = '@@router5/TRANSITION_ERROR';
const TRANSITION_START = '@@router5/TRANSITION_START';
const TRANSITION_CANCEL = '@@router5/TRANSITION_CANCEL';

export {
    TRANSITION_SUCCESS,
    TRANSITION_ERROR,
    TRANSITION_START,
    TRANSITION_CANCEL
};

function xsPluginFactory(listener) {
    return function xsPlugin() {
        const dispatch = (type, isError) => (toState, fromState, error) => {
            if (listener) {
                const routerEvt = { type, toState, fromState };

                listener.next(isError ? { ...routerEvt, error } : routerEvt);
            }
        };

        return {
            onStop: () => listener.complete(),
            onTransitionSuccess: dispatch(TRANSITION_SUCCESS),
            onTransitionError: dispatch(TRANSITION_ERROR, true),
            onTransitionStart: dispatch(TRANSITION_START),
            onTransitionCancel: dispatch(TRANSITION_CANCEL)
        };
    };
}

function createObservables(router) {
    // Events observable
    const transitionEvents$ = xs.create({
        start(listener) {
            router.usePlugin(xsPluginFactory(listener));
        },
        stop() {}
    });

    // Transition Route
    const transitionRoute$ = transitionEvents$
        .map(_ => (_.type === TRANSITION_START ? _.toState : null))
        .startWith(null);

    // Error
    const transitionError$ = transitionEvents$
        .filter(_ => _.type)
        .map(_ => (_.type === TRANSITION_ERROR ? _.error : null))
        .startWith(null)
        .compose(dropRepeats());

    // Route with intersection
    const routeState$ = transitionEvents$
        .filter(_ => _.type === TRANSITION_SUCCESS && _.toState !== null)
        .map(({ toState, fromState }) => {
            const { intersection } = transitionPath(toState, fromState);
            return { intersection, route: toState };
        })
        .startWith({ intersection: '', route: router.getState() });

    // Create a route observable
    const route$ = routeState$.map(({ route }) => route);

    // Create a route node observable
    const routeNode = node =>
        routeState$
            .filter(({ intersection }) => intersection === node)
            .map(({ route }) => route)
            .startWith(router.getState());

    // Return observables
    return {
        route$,
        routeNode,
        transitionError$,
        transitionRoute$
    };
}

export default createObservables;
