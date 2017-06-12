const routerToObservable = (router, onCreate) =>
    Rx.Observable.create(observer => {
        const pushState = (type, isError) => (toState, fromState, ...args) => {
            const routerEvt = { type, toState, fromState };
            observer.onNext(isError ? { ...routerEvt, error: args[0] } : routerEvt);
        };
        const push = type => () => observer.onNext({ type });

        // A Router5 plugin to push any router event to the observer
        const cyclePlugin = () => ({
            name: 'CYCLE_DRIVER',
            onStart: push('start'),
            onStop: push('stop'),
            onTransitionSuccess: pushState('transitionSuccess'),
            onTransitionError:  pushState('transitionError', true),
            onTransitionStart:  pushState('transitionStart'),
            onTransitionCancel: pushState('transitionCancel')
        });

        // Register plugin and start
        router.usePlugin(cyclePlugin);

        // On observable create callback (used to start router)
        onCreate && onCreate();
    });

export default routerToObservable;
