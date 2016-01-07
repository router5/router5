/* istanbul ignore next */
function loggerPlugin(router) {
    const startGroup = () => console.group('Router transition');
    const endGroup = () => console.groupEnd('Router transition');

    return {
        name: 'LOGGER',
        onStart() {
            console.info('Router started');
        },
        onStop() {
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
            console.warn('Transition error with code ' + err.code);
            endGroup();
        },
        onTransitionSuccess(toState, fromState) {
            console.log('Transition success');
            endGroup();
        }
    };
}

export default loggerPlugin;
