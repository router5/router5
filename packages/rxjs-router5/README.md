[![npm version](https://badge.fury.io/js/rxjs-router5.svg)](https://badge.fury.io/js/rxjs-router5)

# rxjs-router5

[rxjs (RxJS 5+)](http://reactivex.io/rxjs/) integration with [router5](http://router5.github.io)

```sh
npm install --save rxjs-router5
```

### Usage

_rxjs-router5_ exports a single function `createObservables`:

```js
import createRouter from 'router5';
import createObservables from 'rxjs-router5';

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
- `routeNode(nodeName)`: a function returning an observable of route updates for the specified node. See [understanding router5](http://router5.github.io/docs/understanding-router5.html).

### Related

- [xstream-router5](../xstream-router5)
