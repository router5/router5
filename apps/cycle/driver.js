import Rx from 'rx';
import transitionPath from 'router5.transition-path';

const sourceMethods = [ 'buildUrl', 'buildPath', 'matchUrl', 'matchPath', 'areStatesDescendants', 'isActive' ];
const sinkMethods = [ 'cancel', 'start', 'stop', 'navigate', 'canActivate', 'canDeactivate' ];

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

const makeRouterDriver = (router, autostart = true) => {
    const transition$ = Rx.Observable.create(observer => {
        const pushState = type => (toState, fromState) => observer.onNext({ type, toState, fromState });
        const push = type => () => observer.onNext({ type });

        const cyclePlugin = () => ({
            name: 'CYCLE_DRIVER',
            onStart: push('start'),
            onStop: push('stop'),
            onTransitionSuccess: pushState('transitionSuccess'),
            onTransitionError:  pushState('transitionError'),
            onTransitionStart:  pushState('transitionStart'),
            onTransitionCancel: pushState('transitionCancel')
        });

        router.usePlugin(cyclePlugin);
        if (!router.started && autostart) {
            router.start();
        }
    });

    const filter = type => transition$.filter(_ => _.type === type);
    const slice = type => filter(type).map(_ => _.type);
    const sliceSlate = type => filter(type).map(({ toState, fromState }) => ({ toState, fromState }));

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

    const node$ = routeState$.map(({ intersection }) => intersection);
    const route$ = routeState$.map(({ route }) => route);
    const routeNode$ = node => routeState$
        .filter(({ intersection }) => intersection === node)
        .map(({ route }) => route);

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
            node$,
            routeNode$
        };
    };
};

export default makeRouterDriver;
