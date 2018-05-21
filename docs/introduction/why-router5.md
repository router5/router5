# Why router5


`router5` is part of a new generation of routers: instead of rendering "views" or "pages", router5 outputs its state. The main idea behind router5 is to treat routing state like any other application data or state.

"Traditional" routing has been heavily influenced by server-side routing, which is stateless, while client-side routing is stateful. For more in-depth description of router5, look at [Understanding router5](./core-concepts.md).


## What is router5 best suited for?

Router 5 is best suited for component-based architectures, where components can easily be composed together. It works best with React, Preact, Inferno, Cycle.js, etc...

It also works very well with state containers like [Redux](http://redux.js.org/): your state container is placed between your view and your router, and your view subscribes to state updates (rather than directly subscribing to route updates).

See available integrations:
- [With React](../integration/with-react.md)
- [With Redux](../integration/with-redux.md)


## ReactiveConf 2016 talk

Watch my talk at ReactiveConf 2016: "Past and future of client-side routing", it gives a great overview of what routing is, and what router5 does:

{% youtube %}
https://www.youtube.com/watch?v=hblXdstrAg0
{% endyoutube %}
