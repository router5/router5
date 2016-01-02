var path = require('path');

module.exports = {
    context: path.join(__dirname + '/modules'),
    entry: './index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        library: 'router5',
        libraryTarget: 'amd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, '/modules')
            }
        ]
    }
}
