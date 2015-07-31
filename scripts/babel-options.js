module.exports = function (module) {
    return {
        stage: 0,
        modules: module,
        // moduleId: 'route-node',
        resolveModuleSource: function (source, filename) {
            return source.replace(/\/(es6|modules)\/.*$/, '');
        }
    };
};
