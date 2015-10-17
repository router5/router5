function onStart() {
    console.log('router started');
}

function onStop() {
    console.log('router stopped');
}

function onTransitionSuccess(toState, fromState) {
    console.log('Transition success');
}

function onTransitionError(toState, fromState, err) {
    console.log('Transition error');
}

function onTransitionCancel(toState, fromState) {
    console.log('Transition cancelled');
}

function onTransitionStart(toState, fromState) {
    console.log('Transition started');
}

function logger() {
    return {
        pluginName: 'logger',
        onStart,
        onStop,
        onTransitionSuccess,
        onTransitionError,
        onTransitionCancel,
        onTransitionStart
    };
}

export default logger;
