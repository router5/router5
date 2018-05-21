# Defining routes

There are a few ways to add routes to your router. You can specify your routes when creating a router instance and / or use chainable `add` and `addNode` methods to add routes.

## With plain objects

You can define your routes as a flat array or nested array of routes. When using a flat array of routes, nested route names need to have their full name specified.

Route objects optionally accept the following properties:
- `canActivate`: a method to control whether or not the route node can be activated (see [Preventing navigation](./preventing-navigation.html))
- `forwardTo`: if specified, the router will transition to the forwarded route instead. It is useful for defaulting to a child route
- `defaultParams`: an object of default params to extend when navigating and when matching a path
- `encodeParams(stateParams)`: a function of state params returning path params. Used when building a path given a route name and params (typically on start and navigation).
- `encodeParams(pathParams)`: a function of path params returning params. Used when matching a path to map path params to state params.

Note on `encodeParams` and `decodeParams`: one can't be used without another, and applying one after another should be equivalent to an identity function.

__encodeParams(stateParams: Object): Object__

A function taking state params and returning path params.

__decodedParams

__Flat array of routes__

```javascript
const routes = [
    { name: 'users',      path: '/users'},
    { name: 'users.view', path: '/view'},
    { name: 'users.list', path: '/list'}
];
```

__Nested arrays of routes__


```javascript
const routes = [
    { name: 'users', path: '/users', children: [
        { name: 'view', path: '/view'},
        { name: 'list', path: '/list'}
    ]}
];
```


__Nested arrays of routes__

## Adding routes

You can add all your routes at once using `createRouter` or `router.add`.

__createRouter(routes, options)__

```javascript
const router = createRouter(routes, options);
```

__add(routes)__

`.add()` accepts single nodes, flat or nested arrays.

```javascript
myRouter.add({ name: 'about', path: '/about' });
// Or
myRouter.add([
    {name: 'about',   path: '/about'},
    {name: 'contact', path: '/contact'},
]);
```

__addNode(name, path[, canActivate])__

You can add routes node by node, specifying a node name and its segment path.

```javascript
var router = createRouter()
    .addNode('users',      '/users')
    .addNode('users.view', '/view/:id')
    .addNode('users.list', '/list');
```

## Configuring the root node path

At the top of your tree of routes, there is an unamed node called the root node. Its path is empty and can be configured using `router.setRootPath(path)`. It can be used for example to list a number of allowed query parameters for all routes in strict query parameters mode (`router.setRootPath('?param1&param2')`).
