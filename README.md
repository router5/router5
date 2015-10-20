[![npm version](https://badge.fury.io/js/router5.svg)](http://badge.fury.io/js/router5)
[![Build Status](https://travis-ci.org/router5/router5.svg)](https://travis-ci.org/router5/router5)
[![Coverage Status](https://coveralls.io/repos/router5/router5/badge.svg)](https://coveralls.io/r/router5/router5)

# router5

[![Join the chat at https://gitter.im/router5/router5](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/router5/router5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Official website: [router5.github.io](http://router5.github.io)

A simple, powerful, modular and extensible router, based on [route-node](https://github.com/troch/route-node)
and [path-parser](https://github.com/troch/path-parser).


### What is it?

It is a __router__, organising __named routes__ in a __tree__ and handling route transitions.
In its simplest form, Router5 processes routing __instructions__ and outputs __state__ updates.


```
                   __________________
                  |                  |
    Instruction   |                  |   State
    ------------->|     ROUTER5      |---------->
                  |                  |
                  |__________________|
```

_Router5_ is library and framework agnostic, and makes no asumption on your implementation.
It favours __convention over configuration__, by giving you the means to observe route changes
and to react to them. Afterall, why treat route changes any different than data changes?

You can read more about motivations behind it here: [Why router5?](http://router5.github.io/docs/why-router5.html).

To get started, look here: [Get started](http://router5.github.io/docs/get-started.html)


<iframe src="//slides.com/thomasroch/deck/embed" width="100%" height="500" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>


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

- __[router5-listeners](/router5/router5-listeners)__: allows you to add route change and node listenerns. Node listeners are triggered if that named route node is the node a component tree needs to be re-rendered from.
- __[router5-history](/router5/router5-history)__: updates your browser URL and state using HTML5 history API and listens to popstate events. Supports use of hash in URL, but session history is still required: deciding to use a hash or not is therefore not a decision based on browser support, but rather a decision based on server capabilities!


### Guides

- [Configuring routes](http://router5.github.io/docs/configuring-routes.html)
- [Path syntax](http://router5.github.io/docs/path-syntax.html)
- [Navigation](http://router5.github.io/docs/navigation.html)
- [Preventing navigation](http://router5.github.io/docs/preventing-navigation.html)
- [Listeners](http://router5.github.io/docs/listeners.html)
- [Transition](http://router5.github.io/docs/transition.html)
- [Universal applications](http://router5.github.io/docs/universal-applications.html)


### API

- [API Reference](http://router5.github.io/docs/preventing-navigation.html)


### Examples

- [With React](http://router5.github.io/docs/with-react.html)
- [With Deku](http://router5.github.io/docs/with-deku.html)


### Integration

- [router5-react](https://github.com/router5/router5-react)
- [router5-deku](https://github.com/router5/router5-deku)
- [cyclejs driver gist](https://gist.github.com/axefrog/217e522282a7948737e1)


### Related

- [path-parser](https://github.com/troch/path-parser)
- [route-node](https://github.com/troch/route-node)
