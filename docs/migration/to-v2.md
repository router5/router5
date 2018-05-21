# Migrating from 1.x to 2.x


## New features

* You can now pass to `router.add()` objects containing `canActivate` functions and those functions will be registered. No need to call for each route `addNode` or `canActivate`.
* Persistent parameters plugin now available.

## Breaking change

* `router.registerComponent` and `router.deregisterComponent` have been removed in favour of `canDeactivate`
* Additional arguments now apply to middleware functions.
* Context has been removed from middleware functions.
* Middleware functions are now a function taking a router instance and returning a function called on each transition.
* Plugins, like middleware functions, are now a function taking a router instance and returning an object of methods (which doesn't contain an `init` function anymore).
* `autoCleanUp` is no longer shared with _router5-listeners_. If you need to turn off automatic deregistration of node listeners, pass `{ autoCleanUp: false }` to the listeners plugin.
* `router5` package now exports `Router5` as default, and `RouteNode`, `loggerPlugin`, `errCodes` and `transitionPath` as named exports

## Code example

__ES2015+__

```javascript
import Router5, { loggerPlugin } from 'router5';
import historyPlugin from 'router5-history';
import listenersPlugin from 'router5-listeners';

const router = new Router5()
    .add([{
        name: 'home',
        path: '/home'
    }])
    .usePlugin(historyPlugin())
    .usePlugin(listenersPlugin())
    // Development helper
    .usePlugin(loggerPlugin())
    .start();
```

__ES5__

```javascript
var router5 = require('router5');
var Router5 = router5.default;
var loggerPlugin = router5.loggerPlugin;

var historyPlugin = require('router5-history');
var listenersPlugin = require('router5-listeners');

var router = new Router5()
    .add([{
        name: 'home',
        path: '/home'
    }])
    .usePlugin(historyPlugin())
    .usePlugin(listenersPlugin())
    // Development helper
    .usePlugin(loggerPlugin())
    .start();
```
