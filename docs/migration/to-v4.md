# Migrating from 3.x to 4.x


With version 4.0.0, _router5_ has been refactored. API for plugins, middleware functions, `canActivate` and `canDeactivate` functions are now consistent.

## Router instanciation

_router5_ default export is now a `createRouter` function as opposed to a `Router5` class. The API is identical between `createRouter(routes, options)` and `new Router5(routes, options)`.

```js
import createRouter from 'router5';

const router = createRouter(routes, options);
```

## Plugins moved

`router5-history`, `router5-persistent-params` and `router5-listeners` have been moved to router5 main repository. They are no longer individual modules but are distributed with router5 module.

```js
import browserPlugin from 'router5/plugins/browser';
import listenersPlugin from 'router5/plugins/listeners';
import persistentParamsPlugin from 'router5/plugins/persistentParams';
```

The history plugin has been renamed 'browser plugin', to better describe its responsabilities. It deals with any URL related options and methods, to make router5 fully runtime environment agnostic:
- `useHash`, `hashPrefix` and `base` options need to be passed to `browserPlugin`, not router5
- `buildUrl`, `matchUrl` and `urlToPath` methods are no longer present by default and are added to your router instance by `browserPlugin`.

```js
import browserPlugin from 'router5/plugins/browser';

router.usePlugin(browserPlugin({
    useHash: true
}));
```

## Dependency injection reworked

Dependency injection has been reworked: `setAdditionalArgs` has been renamed to `setDependencies` / `setDependency` and `getAdditionalArgs` has been renamed to `getDependencies`.

```js
router.setDependency('store', store);
// Or
router.setDependencies({ store });

router.getDependencies(); // => { store: store }
```

Dependencies are no longer injected before `toState` in middleware, canActivate and canDeactivate functions. Instead, they are injected alongside `router`, and are now available in plugins too. They are passed as an object of key / value pairs: it will now be easier to share code, plugins, middleware without sharing the exact same dependencies.


## Middleware and route lifecycle functions alignment

canActivate and canDeactivate functions have been reworked to be aligned with middleware functions.

```js
function isAdmin(router, dependencies) {
    return function (toState, fromState, done) {
        /* boolean, promise or call done */
    }
}

router.canActivate('admin', isAdmin);
```

Boolean shortcuts are still supported (`canActivate('admin', isAdmin)`).

More importantly, they are now __thunks__: they are executed when added, and their returned functions will be executed when required by the router. It enables the use of __closures__.


## Unknown routes (not found) supported

A new `allowNotFound` option available, to give a new strategy to deal with unkown routes.

If `defaultRoute` option is not supplied and a path cannot be matched by the router, then the router will emit an `ROUTE_NOT_FOUND` error unless `allowNotFound` is set to true. In that case, the router will allow the transition to happen and will generate a state like the following one (given a User tried to navigate to an unknown URL `/route-not-found`):

```js
import { constants } from 'router5';

{
    name: constants.UNKNOWN_ROUTE
    params: { path: '/route-not-found' },
    path: '/route-not-found'
}
```

## Other notable changes

* AMD and globals bundle are no longer distributed, use the UMD bundle instead
* `usePlugin` and `useMiddleware` behave the same: you can supply one or more argument, and calling them thereafter will add more plugins / middleware functions (`useMiddleware` used to overwrite middleware functions)
* `errCodes` has been renamed to `errorCodes`
* Route parameters and transition options are now optional in `navigate`, allowing users to only supply a route name and a done callback (`router.navigate('home', () => { /* ... */ })`)
* A new `setRootNodePath` function has been added to configure the path of the root node. It can be used for example to list a number of allowed query parameters for all routes if `strictQueryParams` option is set to `true`.
