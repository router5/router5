import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'umd';

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    plugins: [
        'transform-object-rest-spread',
        'transform-export-extensions'
    ],
    babelrc: false
};

const dest = {
    amd:  `dist/amd/react-router5.js`,
    umd:  `dist/umd/react-router5.js`
}[format];

export default {
    entry: 'modules/index.js',
    format,
    plugins: [ babel(babelOptions), npm({ jsnext: true, skip: [ 'react' ] }) ],
    moduleName: 'reactRouter5',
    moduleId: 'reactRouter5',
    dest
};
