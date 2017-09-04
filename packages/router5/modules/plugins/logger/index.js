/* istanbul ignore next */
/*eslint no-console: 0*/
const noop = () => {};

function loggerPlugin() {
    const supportsGroups = console.group && console.groupEnd;
    const startGroup = supportsGroups
        ? () => console.group('Router transition')
        : noop;
    const endGroup = supportsGroups
        ? () => console.groupEnd('Router transition')
        : noop;

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
}

loggerPlugin.pluginName = 'LOGGER_PLUGIN';

export default loggerPlugin;
