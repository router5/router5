# Plugins

router5 is extensible with the use of plugins. Plugins can decorate a route instance and do things on specific router and transition events.

## Plugin requirements

A plugin is a function taking a router instance and returning an object with a name and at least one of the following methods:

-   `onStart()`: invoked when `router.start()` is called
-   `onStop()`: invoked when `router.stop()` is called
-   `onTransitionStart(toState, fromState)`
-   `onTransitionCancel(toState, fromState)`
-   `onTransitionError(toState, fromState, err)`
-   `onTransitionSuccess(toState, fromState, opts)` \(options contains `replace` and `reload` boolean flags\)
-   `teardown()`: a function called when removing the plugin

## Registering a plugin

```javascript
function myPlugin(router, dependencies) {
    return {
        onTransitionSuccess: (toState, fromState) => {
            console.log(
                'Yippee, navigation to ' + toState.name + ' was successful!'
            )
        }
    }
}

const router = createRouter()

router.usePlugin(myPlugin)
```

## Plugin examples

-   [Browser plugin](https://github.com/router5/router5/blob/master/packages/router5-plugin-browser/modules/index.ts)
-   [Persistent params plugin](https://github.com/router5/router5/blob/master/packages/router5-plugin-persistent-params/modules/index.ts)
-   [Logger](https://github.com/router5/router5/blob/master/packages/router5-plugin-logger/modules/index.ts)

Router5 includes a logging plugin that you can use to help development

```javascript
import createRouter, { loggerPlugin } from 'router5'

const router = createRouter()

const teardownPlugin = router.usePlugin(loggerPlugin)
```
