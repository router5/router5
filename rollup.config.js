import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import npm from 'rollup-plugin-npm';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    plugins: [
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-export-extensions'
    ],
    babelrc: false
};

const dest = {
    amd:  `dist/amd/router5${ compress ? '.min' : '' }.js`,
    umd:  `dist/umd/router5${ compress ? '.min' : '' }.js`,
    iife: `dist/browser/router5${ compress ? '.min' : '' }.js`
}[format];

export default {
    entry: 'modules/index.js',
    format,
    plugins: [ babel(babelOptions), npm({ jsnext: true }) ].concat(compress ? uglify() : []),
    moduleName: 'router5',
    moduleId: 'router5',
    dest
};
