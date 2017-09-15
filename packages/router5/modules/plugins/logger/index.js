/* istanbul ignore next */
/*eslint no-console: 0*/
const noop = () => {};

function loggerPlugin() {
    let startGroup, endGroup;

    if (console.groupCollapsed) {
        startGroup = label => console.groupCollapsed(label);
        endGroup = () => console.groupEnd();
    } else if (console.group) {
        startGroup = label => console.group(label);
        endGroup = () => console.groupEnd();
    } else {
        startGroup = noop;
        endGroup = noop;
    }

    console.info('Router started');

    return {
        onStop() {
            console.info('Router stopped');
        },
        onTransitionStart(toState, fromState) {
            endGroup();
            startGroup('Router transition');
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
