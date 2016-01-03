var webpack = require('webpack');
var path = require('path');

function makeConfig(target) {
    var directories = {
        'amd': 'amd',
        'umd': 'umd',
        'var': 'browser'
    };

    function makeBase(prod) {
        return {
            context: path.join(__dirname + '/modules'),
            entry: './index.js',
            output: {
                path: __dirname + '/dist',
                filename: path.join(directories[target], prod ? 'router5.min.js' : 'router5.js'),
                library: 'router5',
                libraryTarget: target
            },
            plugins: prod ? [
                    new webpack.DefinePlugin({
                        'process.env': {
                            'NODE_ENV': JSON.stringify('production')
                        }
                    }),
                    new webpack.optimize.UglifyJsPlugin()
                ] : [],
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        loaders: ['babel'],
                        include: path.join(__dirname, '/modules')
                    }
                ]
            }
        };
    }

    return [
        makeBase(false),
        makeBase(true)
    ];
}

module.exports = []
    .concat(makeConfig('var'))
    .concat(makeConfig('umd'))
    .concat(makeConfig('amd'));
