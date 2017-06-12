/* istanbul ignore next */
/*eslint no-console: 0*/

function loggerPlugin() {
    const startGroup = () => console.group('Router transition');
    const endGroup = () => console.groupEnd('Router transition');

    console.info('Router started');

    return {
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
        onTransitionCancel() {
            console.warn('Transition cancelled');
        },
        onTransitionError(toState, fromState, err) {
            console.warn('Transition error with code ' + err.code);
            endGroup();
        },
        onTransitionSuccess() {
            console.log('Transition success');
            endGroup();
        }
    };
};

loggerPlugin.pluginName = 'LOGGER_PLUGIN';

export default loggerPlugin;
