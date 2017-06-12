/* istanbul ignore next */
/*eslint no-console: 0*/

function loggerPlugin() {
    var startGroup = function startGroup() {
        return console.group('Router transition');
    };
    var endGroup = function endGroup() {
        return console.groupEnd('Router transition');
    };

    console.info('Router started');

    return {
        onStop: function onStop() {
            console.info('Router stopped');
        },
        onTransitionStart: function onTransitionStart(toState, fromState) {
            endGroup();
            startGroup();
            console.log('Transition started from state');
            console.log(fromState);
            console.log('To state');
            console.log(toState);
        },
        onTransitionCancel: function onTransitionCancel() {
            console.warn('Transition cancelled');
        },
        onTransitionError: function onTransitionError(toState, fromState, err) {
            console.warn('Transition error with code ' + err.code);
            endGroup();
        },
        onTransitionSuccess: function onTransitionSuccess() {
            console.log('Transition success');
            endGroup();
        }
    };
};

loggerPlugin.pluginName = 'LOGGER_PLUGIN';

export default loggerPlugin;