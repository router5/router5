import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'amd';
const compress = argv.uglify;

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    plugins: [
        'transform-object-rest-spread',
        'transform-export-extensions'
    ],
    babelrc: false
};

const dest = {
    amd:  'dist/amd/redux-router.js',
    umd:  'dist/umd/redux-router.js'
}[format];

export default {
    entry: 'modules/index.js',
    format,
    plugins: [ babel(babelOptions), npm({ jsnext: true }) ],
    moduleName: 'reduxRouter5',
    moduleId: 'reduxRouter5',
    dest
};
