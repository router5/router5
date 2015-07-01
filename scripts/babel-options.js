module.exports = function (module) {
    return {
        modules: module,
        // moduleId: 'route-node',
        resolveModuleSource: function (source, filename) {
            return source.replace(/\/(es6|modules)\/.*$/, '');
        }
    };
};
