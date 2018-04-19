const express = require('express')
const path = require('path')

const port = 8081
const app = express()

app
    .disable('x-powered-by')
    .use(
        express.static(path.join(__dirname, 'public'), {
            etag: false,
            setHeaders: res => {
                res.set(
                    'Cache-Control',
                    'public, max-age=2592000, stale-while-revalidate=86400, stale-if-error=86400'
                )
            }
        })
    )
    .get('*', (req, res) =>
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    )

app.listen(port, 'localhost', function(err) {
    if (err) {
        console.log(err)
        process.exit(1)
    }

    console.log(`Listening at http://localhost:${port}`)
})
