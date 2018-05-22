# Universal routing

_Router5_ is capable to run on the server and in clients. This enables you to reuse the same routes for both client-side navigation and server-side pre-rendering. This is essentially done via two steps:

1. **Server-side** - Pass to your router the current URL \(using `start`\), and pass the resolved state to your client.
2. **Client-side** - Pass to your router the starting state received from the server and pass it to your router, so it can start with the provided state \(and won't run the transition to the already activated page\).

## Create your router \(client & server\)

You can use the same code for configuring your router on both client and server sides. The history plugin, for example, can be safely used on Node.js and in browsers.

```javascript
const createRouter = require( 'router5' ).default;
const browserPlugin = require( 'router5/plugins/browser' );

function createRouter() {
    return createRouter([
            { name: 'home', path: '/home' },
            { name: 'about', path: '/about' },
            { name: 'contact', path: '/contact' },
            { name: '404', path: '/404' }
        ], {
            trailingSlash: true,
            defaultRoute: '404'
        })
        .usePlugin(browserPlugin({
            useHash: false
        }))
}

export default createRouter
```

## Server-side Routing

> This example is an [Express](http://expressjs.com/) with [Swig](http://paularmstrong.github.io/swig/) application. Make changes where needed to suit your preferred frameworks.

For universal applications, you need to:

* Create a new router instance for each request, using the request URL
* Send the state to the client and start your router with this initial state

`server.js`

```javascript
import express from 'express';
import createRouter from 'router5';
import swig from 'swig';

const app = express();

// Swig is used for templating in this example
// Use what you are comfortable with
app.engine( 'html', swig.renderFile );
app.set( 'view engine', 'html' );
app.set( 'views', './views' );

app.get( '*', ( req, res ) => {
    // Create a new router for each request
    const router = createRouter();

    router.start( req.originalUrl, function done( error, state ) {
        if ( error ) {
            res.status( 500 ).send( error );
        } else {
            res.send(/* Use your router state, send some HTML! */ );
        }
    });

} );

app.listen( 8080, function logServerStart() {
    console.log( 'Server is listening on port 8080...' );
} );
```

`base.html`

```markup
<!doctype html>
<html lang="en-US">
    <head>
        <title>Example Server-side Routing</title>
    </head>

    <body>
        <script src="/js/router.js"></script>
        <script type="text/javascript">
            /**
             * Load the App's inital state from the server
             * @type {JSON}
             */
            var initialState = JSON.parse('{{ initialState | safe }}');


            /**
             * Start our Router
             * @param  {Error} error  Router start error
             * @param  {Object} state State Object
             * @return {undefined}
             */
            app.router.start(initialState, function(error, state) {
                if (error) console.error('router error', error);
            });
        </script>
    </body>

</html>
```

From here forth, you can continue to use router5 as if it was a regular Single-Page Application.

## Performance

A new router has to be created server-side on each request. If your app is large \(containing dozens of routes\), the creation of your router will take up to a couple of hundred milliseconds.

Instead of creating a new router for each request, router5 includes a cloning mechanism: create a base router, and clone it for each request.

{% hint style="info" %}
A user reported a gain from 300ms to 10ms per request for creating a new router, with cloning.
{% endhint %}

```javascript
const baseRouter = createRouter(/* ... */);

const router = baseRouter.clone(dependencies);
```

