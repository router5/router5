import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';

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
    plugins: [ babel(babelOptions), npm({ jsnext: true }) ],
    moduleName: 'reduxRouter5',
    moduleId: 'reduxRouter5',
    dest: 'dist/umd/redux-router5.js'
};
