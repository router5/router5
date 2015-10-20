function loggerPlugin() {
    const startGroup = () => console.group('Router transition');
    const endGroup = () => console.groupEnd('Router transition');

    return {
        name: 'LOGGER',
        onStart: function () {
            console.info('Router started');
        },
        onStop: function () {
            console.info('Router stopped');
        },
        onTransitionStart(toState, fromState) {
            endGroup();
            startGroup();
            console.log('Transition started from state');
            console.log(fromState);
            console.log('To state');
            console.log(toState);
        },
        onTransitionCancel(toState, fromState) {
            console.warn('Transition cancelled');
        },
        onTransitionError(toState, fromState, err) {
            console.warn('Transition error with code ' + err);
            endGroup();
        },
        onTransitionSuccess(toState, fromState) {
            console.log('Transition success');
            endGroup();
        }
    }
}

export default loggerPlugin;
