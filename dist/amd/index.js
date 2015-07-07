define(['exports', 'module', './link-factory', './segment-mixin-factory'], function (exports, module, _linkFactory, _segmentMixinFactory) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _linkFactory2 = _interopRequireDefault(_linkFactory);

    var _segmentMixinFactory2 = _interopRequireDefault(_segmentMixinFactory);

    module.exports = {
        linkFactory: _linkFactory2['default'],
        segmentMixinFactory: _segmentMixinFactory2['default']
    };
});