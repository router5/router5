'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _linkFactory = require('./link-factory');

var _linkFactory2 = _interopRequireDefault(_linkFactory);

var _segmentMixinFactory = require('./segment-mixin-factory');

var _segmentMixinFactory2 = _interopRequireDefault(_segmentMixinFactory);

exports['default'] = {
    linkFactory: _linkFactory2['default'],
    segmentMixinFactory: _segmentMixinFactory2['default']
};
module.exports = exports['default'];