[![npm version](https://badge.fury.io/js/router5.svg)](http://badge.fury.io/js/router5)
[![Build Status](https://travis-ci.org/router5/router5.svg)](https://travis-ci.org/router5/router5)
[![Coverage Status](https://coveralls.io/repos/router5/router5/badge.svg)](https://coveralls.io/r/router5/router5)
[![Join the chat at https://gitter.im/router5/router5](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/router5/router5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Official website: [router5.github.io](http://router5.github.io)

# router5

A simple, powerful, modular and extensible router, organising your __named routes__ in a __tree__ and handling route transitions.
In its simplest form, router5 processes routing __instructions__ and outputs __state__ updates.

_router5_ is library and framework agnostic, works universally, and makes no asumption on your implementation. It favours __convention over configuration__, by giving you the means to observe route changes
and to react to them. Afterall, why treat route changes any different than data changes?

To get started, look here: __[Understanding router5](http://router5.github.io/docs/understanding-router5.html)__ and __[Get started](http://router5.github.io/docs/get-started.html)__.

```js
import createRouter from 'router5';
import browserPlugin from 'router5/plugins/browser';

const routes = [
    { name: 'home', '/home' },
    { name: 'profile', '/profile' }
];

const router = createRouter(routes)
    .usePlugin(browserPlugin());
```

### v4.0.0

Version 4 is a refactor of router5, some of the API has slightly changed: [release notes are available](http://router5.github.io/docs/migration-4.html)

### Flexible

router5 offers two essential tools: __middlewares__ and __plugins__.

-__Middlewares__ allow you to decide the fate of a transition: you can delay it while performing asynchronous operations (data loading), fail it or simply hook some custom business logic.
- __Plugins__ are perfect for side-effects and 3rd party integration, by allowing you to react to router events: when it starts or stops, when a transition starts, is successful, has failed or has been cancelled. You can use them for updating the page title in the browser, sending page view analytic events, creating observables, sending your router state to a data store, etc...

### Features

- __Default start route__: a default route to navigate to on load if the current URL doesn't match any route. Similar to `$routeProvider.otherwise()` in _Angular ngRoute_ module.
- __Unknown routes__: if redirects to a default route is not how you want to handle unknown routes, router5 can generate state objects for them instead.
- __Start__ and __stop__
- __Nested named routes__: routes are identified by names and path (containing parameters) so you don't have to manipulate URLs, even query parameters don't need to be specified on leaves only.
directly. Routes can be nested, introducing the notion of _route segments_.
- __Segments activation__: you can control whether or not a route can be accessed by specifying a `canActivate`
function per node. Supports asynchronous results.
- __Segments deactivation__: you can register segment components. On a route change, it will ask those components through their `canDeactivate` method if they allow navigation. Similar to _Angular 2_ and _Aurelia_ routers. Supports asynchronous results.
- __Custom plugins__: extend your router behaviour with custom plugins
- __Middleware functions__: handle any data updates or other asynchronous actions with multiplebefore updating your view.
- __Universal applications__: use on client and server side
- __Redirections__: redirect to another route on error
- __You are in control!__ You decide what to do on a route change and how to do it.


### Plugins

Several plugins are available in this repository:

- __Listeners plugin__: allows you to add various types of route change listeners.
- __Browsers plugin__: use of hash or not, URL building, HTML5 history integration.
- __Persistent parameters plugin__: allows some query parameters to persist and survive navigation, without having to manually specify them for each transition.

```js
import browserPlugin from 'router/plugins/browser';
import listenersPlugin from 'router/plugins/listeners';
import persistentParamsPlugin from 'router/plugins/persistentParams';
```

### Guides

- [Configuring routes](http://router5.github.io/docs/configuring-routes.html)
- [Router options](http://router5.github.io/docs/router-options.html)
- [Path syntax](http://router5.github.io/docs/path-syntax.html)
- [Navigation](http://router5.github.io/docs/navigation.html)
- [Preventing navigation](http://router5.github.io/docs/preventing-navigation.html)
- [Custom errors and redirections](http://router5.github.io/docs/custom-errors.html)
- [Middleware functions](http://router5.github.io/docs/middleware.html)
- [Transition](http://router5.github.io/docs/transition.html)
- [Using plugins](http://router5.github.io/docs/plugins.html)
- [Universal applications](http://router5.github.io/docs/universal-applications.html)
- [Async data](http://router5.github.io/docs/async-data.html)


### API

- [API Reference](http://router5.github.io/docs/api-reference.html)


### Examples

- [With React](http://router5.github.io/docs/with-react.html)
- [With React and Redux](http://router5.github.io/docs/with-react-redux.html)
- [With Deku 1.0](http://router5.github.io/docs/with-deku.html)
- [With Deku 1.0 and Redux](http://router5.github.io/docs/with-deku-redux.html)
- [With Cycle](http://router5.github.io/docs/with-cycle.html)
- [With Cycle (2)](http://router5.github.io/example-cycle.html#/a)


### Integration

- [react-router5](https://github.com/router5/react-router5)
- [redux-router5](https://github.com/router5/redux-router5)
- [deku-router5](https://github.com/router5/deku-router5)
- [router5-link-interceptor](https://github.com/jas-chen/router5-link-interceptor)
- [cycle-router5](https://github.com/router5/cycle-router5) (work in progress, not released)


### Contributing

Please read [contributing guidelines](./CONTRIBUTING.md).

### Related

- [path-parser](https://github.com/troch/path-parser)
- [route-node](https://github.com/troch/route-node)
