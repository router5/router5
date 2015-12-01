[![npm version](https://badge.fury.io/js/router5.svg)](http://badge.fury.io/js/router5)
[![Build Status](https://travis-ci.org/router5/router5.svg)](https://travis-ci.org/router5/router5)
[![Coverage Status](https://coveralls.io/repos/router5/router5/badge.svg)](https://coveralls.io/r/router5/router5)
[![Join the chat at https://gitter.im/router5/router5](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/router5/router5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Official website: [router5.github.io](http://router5.github.io)

# router5

A simple, powerful, modular and extensible router, organising your __named routes__ in a __tree__ and handling route transitions.
In its simplest form, Router5 processes routing __instructions__ and outputs __state__ updates.

_Router5_ is library and framework agnostic, and makes no asumption on your implementation.
It favours __convention over configuration__, by giving you the means to observe route changes
and to react to them. Afterall, why treat route changes any different than data changes?

<p align="center">
    <a href="http://slides.com/thomasroch/deck"><img alt="Router5 slides" src="https://raw.githubusercontent.com/router5/router5.github.io/master/img/slices_preview.png" /></a>
</p>

To get started, look here: [Get started](http://router5.github.io/docs/get-started.html)

### Features

- __Use of hash (#)__
- __Default start route__: a default route to navigate to on load if the current URL doesn't match any route. Similar to `$routeProvider.otherwise()` in _Angular ngRoute_ module.
- __Start__ and __stop__
- __Nested named routes__: routes are identified by names and parameters so you don't have to manipulate URLs
directly. Routes can be nested, introducing the notion of _route segments_.
- __Segments activation__: you can control whether or not a route can be accessed by specifying a `canActivate`
function per node. Supports asynchronous results.
- __Segments deactivation__: you can register segment components. On a route change, it will ask those components through their `canDeactivate` method if they allow navigation. Similar to _Angular 2_ and _Aurelia_ routers. Supports asynchronous results.
- __Custom plugins__: extend your router behaviour with custom plugins
- __Middleware functions__: handle any data updates or other asynchronous actions with multiplebefore updating your view.
- __Universal applications__: use on client and server side
- __You are in control!__ You decide what to do on a route change and how to do it.


### Plugins

- __[router5-listeners](https://github.com/router5/router5-listeners)__: allows you to add route change and node listenerns. Node listeners are triggered if that named route node is the node a component tree needs to be re-rendered from.
- __[router5-history](https://github.com/router5/router5-history)__: updates your browser URL and state using HTML5 history API and listens to popstate events. Supports use of hash in URL, but session history is still required: deciding to use a hash or not is therefore not a decision based on browser support, but rather a decision based on server capabilities!


### Guides

- [Configuring routes](http://router5.github.io/docs/configuring-routes.html)
- [Router options](http://router5.github.io/docs/router-options.html)
- [Path syntax](http://router5.github.io/docs/path-syntax.html)
- [Navigation](http://router5.github.io/docs/navigation.html)
- [Preventing navigation](http://router5.github.io/docs/preventing-navigation.html)
- [Middleware functions](http://router5.github.io/docs/middleware.html)
- [Transition](http://router5.github.io/docs/transition.html)
- [Using plugins](http://router5.github.io/docs/plugins.html)
- [Universal applications](http://router5.github.io/docs/universal-applications.html)


### API

- [API Reference](http://router5.github.io/docs/api-reference.html)


### Examples

- [With React](http://router5.github.io/docs/with-react.html)
- [With React and Redux](http://router5.github.io/docs/with-react-redux.html)
- [With Deku](http://router5.github.io/docs/with-deku.html)


### Integration

- [react-router5](https://github.com/router5/react-router5)
- [redux-router5](https://github.com/router5/redux-router5)
- [deku-router5](https://github.com/router5/deku-router5)
- [router5-link-interceptor](https://github.com/jas-chen/router5-link-interceptor)
- [cycle-router5](https://github.com/axefrog/cycle-router5) (out of date)


### Contributing

Please read [contributing guidelines](./CONTRIBUTING.md).

### Related

- [path-parser](https://github.com/troch/path-parser)
- [route-node](https://github.com/troch/route-node)
