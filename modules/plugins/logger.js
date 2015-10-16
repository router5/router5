function onSuccess(toState, fromState) {
    console.log('success');
}

function onError(toState, fromState, err) {
    console.log('error');
}

function onCancel(toState, fromState) {
    console.log('cancelled');
}

function onStart(toState, fromState) {
    console.log('started');
}

function logger() {
    return {
        pluginName: 'logger',
        onSuccess,
        onError,
        onCancel,
        onStart
    };
}

export default logger;
