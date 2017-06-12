import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    plugins: [
        'transform-object-rest-spread',
        'transform-export-extensions'
    ],
    babelrc: false
};

export default {
    entry: 'modules/index.js',
    format: 'umd',
    plugins: [ babel(babelOptions), nodeResolve({ jsnext: true }) ],
    moduleName: 'reduxRouter5',
    moduleId: 'reduxRouter5',
    dest: 'dist/umd/redux-router5.js'
};
