[![npm version](https://badge.fury.io/js/xstream-router5.svg)](https://badge.fury.io/js/xstream-router5)

# xstream-router5

[xstream](http://staltz.com/xstream/) integration with [router5](https://router5.js.org)

```sh
npm install --save xstream-router5
```

### Usage

_xstream-router5_ exports a single function `createObservables`:

```js
import createRouter from 'router5';
import createObservables from 'xstream-router5';

const router = createRouter([
    { name: 'home', path: '/home' },
    { name: 'about', path: '/about' }
]);

const {
    route$,
    routeNode,
    transitionError$,
    transitionRoute$
} = createObservables(router)

router.start();

route$.map((route) => { /* ... */ })
```

### Available observables

`createObservables` returns the following observables:
- `route$`: an observable of your application route
- `transitionRoute$`: an observable of the currently transitioning route
- `transitionError$`: an observable of transition errors
- `routeNode(nodeName = '')`: a function returning an observable of route updates for the specified node

### Related

- [rxjs-router5](../rxjs-router5)
