export var getDisplayName = function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
};

export var ifNot = function ifNot(condition, errorMessage) {
    if (!condition) throw new Error(errorMessage);
};