# Defining routes

There are a few ways to add routes to your router. You can specify your routes when creating a router instance and / or use chainable `add` and `addNode` methods to add routes.

## With plain objects

You can define your routes using plain objects:

* `name`: the route name
* `path`: the route path, relative to its parent

Route objects optionally accept the following properties:

* `canActivate`: a method to control whether or not the route node can be activated \(see [Preventing navigation](https://github.com/router5/router5/tree/1cc1c6969a96918deb28e45b8c5b2d6aa19d0a19/docs/guides/preventing-navigation.html)\)
* `forwardTo`: if specified, the router will transition to the forwarded route instead. It is useful for defaulting to a child route
* `defaultParams`: an object of default params to extend when navigating and when matching a path
* `encodeParams(stateParams)`: a function of state params returning path params. Used when building a path given a route name and params \(typically on start and navigation\).
* `decodeParams(pathParams)`: a function of path params returning params. Used when matching a path to map path params to state params.

Note on `encodeParams` and `decodeParams`: one can't be used without another, and applying one after another should be equivalent to an identity function.

### Flat route list

You can define your routes using a flat list, in which case route names must be specified in full.

```javascript
const routes = [
    { name: 'users',      path: '/users'},
    { name: 'users.view', path: '/view'},
    { name: 'users.list', path: '/list'}
];
```

### Tree of routes

You can define your routes using a tree \(making use of `children`\), in which case route names are relative to their parent.

```javascript
const routes = [
    { name: 'users', path: '/users', children: [
        { name: 'view', path: '/view'},
        { name: 'list', path: '/list'}
    ]}
];
```

## Adding routes

You can add all your routes at once using `createRouter` or `router.add`.

### When creating your router

```javascript
const router = createRouter(routes, options);
```

### After creating your router

`.add()` accepts single or multiple nodes, flat or nested.

```javascript
myRouter.add({ name: 'about', path: '/about' });
// Or
myRouter.add([
    {name: 'about',   path: '/about'},
    {name: 'contact', path: '/contact'},
]);
```

## Configuring the root node path

At the top of your tree of routes, there is an unamed node called the root node. Its path is empty and can be configured using `router.setRootPath(path)`. It can be used for example to list a number of allowed query parameters for all routes in strict query parameters mode \(`router.setRootPath('?param1&param2')`\).

