# Router5 browser plugin

The browser plugin will automatically update your browser URL and state on route changes. It will also listen to popstate events (triggered by back and forward buttons and manual URL changes).

## Using the browser plugin

This plugin uses HTML5 history API and therefore is not compatible with browsers which don't support it. Refer to [caniuse.com](http://caniuse.com/#search=history) for browser compatibility.

It adds a bunch of functions to work with full URLs: `router.buildUrl(routeName, routeParams)` and `router.matchUrl(url)`. It also decorates the start function so you don't have to supply any start path (it extracts it from the current URL).

```js
import browserPlugin from 'router5-plugin-browser'

const router = createRouter()

router.usePlugin(
    browserPlugin({
        useHash: true
    })
)

router.start()
```

## Plugin options

-   `forceDeactivate`: default to `true`, meaning `canDeactivate` handlers won't get called on popstate events. It is not recommended to set it to `false`.
-   `useHash`
-   `hashPrefix`
-   `base`: the base of your application (the part to add / preserve between your domain and your route paths).
-   `preserveHash`: whether to preserve the initial hash value on page load (default to `true`, only if `useHash` is `false`)
-   `mergeState`: whether to keep any value added in history state by a 3rd party or not (default to `false`)
