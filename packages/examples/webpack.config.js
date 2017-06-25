const path       = require('path');
const webpack    = require('webpack');

const argv = require('yargs').argv;
const app  = argv.app || 'react';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: [
        './apps/' + app + '/main.js'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: isProd ? 'router5-' + app + '-example.js' : 'app.js'
    },
    plugins: isProd ? [] : [
        new webpack.LoaderOptionsPlugin({
            minimize: isProd,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.join(__dirname, 'apps')
        }]
    }
};
