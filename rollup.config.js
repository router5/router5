import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import npm from 'rollup-plugin-npm';
import { argv } from 'yargs';

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    plugins: [
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-export-extensions'
    ],
    babelrc: false
};

const format = argv.format || 'iife';
const dest = {
    amd:  'dist/amd/router5.js',
    umd:  'dist/umd/router5.js',
    iife: 'dist/browser/router5.js'
}[format];

export default {
    entry: 'modules/index.js',
    format,
    plugins: [ babel(babelOptions), npm({ jsnext: true }) ],
    moduleName: 'router5',
    moduleId: 'router5',
    dest
};
