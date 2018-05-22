# Plugins

router5 is extensible with the use of plugins. Plugins can decorate a route instance and do things on specific router and transition events.

## Plugin requirements

A plugin is a function taking a router instance and returning an object with a name and at least one of the following methods:

* `onStart()`: invoked when `router.start()` is called
* `onStop()`: invoked when `router.stop()` is called
* `onTransitionStart(toState, fromState)`
* `onTransitionCancel(toState, fromState)`
* `onTransitionError(toState, fromState, err)`
* `onTransitionSuccess(toState, fromState, opts)` \(options contains `replace` and `reload` boolean flags\)

## Registering a plugin

```javascript
function myPlugin(router, dependencies) {
    return {
        onTransitionSuccess: (toState, fromState) => {
            console.log('Yippee, navigation to ' + toState.name + ' was successful!');
        }
    };

myPlugin.pluginName = 'MY_PLUGIN';

const router = createRouter()
    .usePlugin(myPlugin);

router.hasPlugin('MY_PLUGIN'); // => true
```

## Plugin examples

* [Browser plugin](https://github.com/router5/router5/blob/master/packages/router5/modules/plugins/browser/index.js)
* [Persistent params plugin](https://github.com/router5/router5/blob/master/packages/router5/modules/plugins/persistentParams/index.js)
* [Logger](https://github.com/router5/router5/blob/master/packages/router5/modules/plugins/logger/index.js)

Router5 includes a logging plugin that you can use to help development

```javascript
import createRouter, { loggerPlugin } from 'router5';

const router = createRouter()
    .usePlugin(loggerPlugin);
```

