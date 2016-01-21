import Rx from 'rx';
import transitionPath from 'router5.transition-path';

const sourceMethods = [ 'buildUrl', 'buildPath', 'matchUrl', 'matchPath', 'areStatesDescendants', 'isActive' ];
const sinkMethods = [ 'cancel', 'start', 'stop', 'navigate', 'canActivate', 'canDeactivate' ];

/**
 * Normalise a sink request to the router driver.
 * @param  {String|Array} req A method name or array containing a method name and arguments
 * @return {Array}            An array containing a method name and its arguments
 */
const normaliseRequest = (req) => {
    const normReq = Array.isArray(req) || typeof req === 'string'
        ? [].concat(req)
        : [];

    if (sinkMethods.indexOf(normReq[0]) === -1) {
        throw new Error('A Router5 sink argument should be a string (method name) or' +
            ' an object which first element is a valid metod name, followed by its arguments.' +
            ' Available sink methods are: ' + sinkMethods.join(',') + '.'
        );
    }

    return normReq;
}

/**
 * Make a cycle router driver from a router5 instance
 * @param  {Router5} router    A Router5 instance
 * @param  {Boolean} autostart Whether or not to start routing if not already started
 * @return {Function}          A cycle sink function
 */
const makeRouterDriver = (router, autostart = true) => {
    // Observe router transitions
    const transition$ = Rx.Observable.create(observer => {
        const pushState = type => (toState, fromState) => observer.onNext({ type, toState, fromState });
        const push = type => () => observer.onNext({ type });

        // A Router5 plugin to push any router event to the observer
        const cyclePlugin = () => ({
            name: 'CYCLE_DRIVER',
            onStart: push('start'),
            onStop: push('stop'),
            onTransitionSuccess: pushState('transitionSuccess'),
            onTransitionError:  pushState('transitionError'),
            onTransitionStart:  pushState('transitionStart'),
            onTransitionCancel: pushState('transitionCancel')
        });

        // Register plugin and start
        router.usePlugin(cyclePlugin);
        if (!router.started && autostart) {
            router.start();
        }
    });

    const filter = type => transition$.filter(_ => _.type === type);
    const slice = type => filter(type).map(_ => _.type);
    const sliceSlate = type => filter(type).map(({ toState, fromState }) => ({ toState, fromState }));

    // Filter router events observables
    const observables = {
        start$: slice('start'),
        stop$: slice('stop'),
        transitionStart$: sliceSlate('transitionStart'),
        transitionCancel$: sliceSlate('transitionCancel'),
        transitionSuccess$: sliceSlate('transitionSuccess'),
        transitionError$: sliceSlate('transitionError')
    };


    const routeState$ = observables.transitionSuccess$
        .map(({ toState, fromState }) => {
            const { intersection } =  transitionPath(toState, fromState);
            return { intersection, route: toState };
        })
        .startWith({ route: router.getState(), intersection: '' })

    // Create a route observable
    const route$ = routeState$.map(({ route }) => route);

    // Create a route node observable
    const routeNode$ = node =>
        routeState$
            .filter(({ intersection }) => intersection === node)
            .map(({ route }) => route);

    // Source API methods ready to be consumed
    const sourceApi = sourceMethods.reduce(
        (methods, method) => ({ ...methods, [method]: (...args) => router[method].apply(router, args) }),
        {}
    );

    return request$ => {
        request$
            .map(normaliseRequest)
            .subscribe(
                ([ method, ...args ]) => router[method].apply(router, args),
                err => console.error(err)
            );

        return {
            ...sourceApi,
            ...observables,
            route$,
            routeNode$
        };
    };
};

export default makeRouterDriver;
