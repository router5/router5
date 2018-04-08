const path = require('path')

module.exports = {
    entry: './app/client.js',
    output: {
        path: path.join(__dirname, 'server', 'public'),
        filename: 'app.js'
    },
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'app')
            }
        ]
    },
    devServer: {
        after(app) {
            app.get('*', function(req, res) {
                res.sendFile(
                    path.join(__dirname, 'server', 'public', 'index.html')
                )
            })
        },
        contentBase: 'public'
    }
}
