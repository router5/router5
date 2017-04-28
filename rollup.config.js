import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';
import common from 'rollup-plugin-commonjs';

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
    plugins: [ common({ include: 'node_modules/**' }), babel(babelOptions), npm({ jsnext: true, skip: [ 'react' ] }) ],
    moduleName: 'reactRouter5',
    moduleId: 'reactRouter5',
    dest: 'dist/umd/react-router5.js'
};
