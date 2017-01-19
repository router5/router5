import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import { argv } from 'yargs';

const compress = argv.uglify;
const module = argv.module || argv.m || 'core';

const babelOptions = {
    runtimeHelpers: true,
    presets: [[ 'es2015', { modules: false }]],
    plugins: [
        'external-helpers',
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-export-extensions'
    ],
    babelrc: false
};

const modules = {
    core: {
        entry: 'modules/index.js',
        moduleName: 'router5',
        moduleId: 'router5',
        dest: `dist/umd/router5${ compress ? '.min' : '' }.js`
    },
    browser: {
        entry: 'modules/plugins/browser/index.js',
        moduleName: 'router5BrowserPlugin',
        moduleId: 'router5BrowserPlugin',
        dest: `dist/umd/router5BrowserPlugin${ compress ? '.min' : '' }.js`
    },
    listeners: {
        entry: 'modules/plugins/listeners/index.js',
        moduleName: 'router5ListenersPlugin',
        moduleId: 'router5ListenersPlugin',
        dest: `dist/umd/router5ListenersPlugin${ compress ? '.min' : '' }.js`
    },
    persistentParams: {
        entry: 'modules/plugins/persistentParams/index.js',
        moduleName: 'router5PersistentParamsPlugin',
        moduleId: 'router5PersistentParamsPlugin',
        dest: `dist/umd/router5PersistentParamsPlugin${ compress ? '.min' : '' }.js`
    }
};

export default Object.assign({}, modules[module], {
    format: 'umd',
    plugins: [ babel(babelOptions), nodeResolve({ jsnext: true }) ].concat(compress ? uglify() : [])
});
