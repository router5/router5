const path = require('path')

const argv = require('yargs').argv
const app = argv.app || 'react-new-context-api'
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    entry: './apps/' + app + '/main.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: isProd ? 'router5-' + app + '-example.js' : 'app.js'
    },
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'apps')
            }
        ]
    }
}
