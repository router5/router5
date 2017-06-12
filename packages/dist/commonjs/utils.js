'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getDisplayName = exports.getDisplayName = function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
};

var ifNot = exports.ifNot = function ifNot(condition, errorMessage) {
    if (!condition) throw new Error(errorMessage);
};