import babel from 'rollup-plugin-babel';

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
    plugins: [ babel(babelOptions) ],
    moduleName: 'dekuRouter5',
    moduleId: 'dekuRouter5',
    dest: 'dist/umd/deku-router5.js'
};
