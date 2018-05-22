# Why router5?

`router5` is part of a new generation of routers: instead of rendering "views" or "pages", router5 outputs its state. The main idea behind router5 is to treat routing state like any other application data or state.

"Traditional" routing has been heavily influenced by server-side routing, which is stateless, while client-side routing is stateful. For more in-depth description of router5, look at [Understanding router5](core-concepts.md).

## What is router5 best suited for?

Router 5 is best suited for component-based architectures, where components can easily be composed together. It works best with React, Preact, Inferno, Cycle.js, etc...

It also works very well with state containers like [Redux](http://redux.js.org/): your state container is placed between your view and your router, and your view subscribes to state updates \(rather than directly subscribing to route updates\).

See available integrations:

* [With React](../integration/with-react.md)
* [With Redux](../integration/with-redux.md)

## ReactiveConf 2016 talk

Watch my talk at ReactiveConf 2016: "Past and future of client-side routing", it gives a great overview of what routing is, and what router5 does:

{% embed data="{\"url\":\"https://www.youtube.com/watch?v=hblXdstrAg0\",\"type\":\"video\",\"title\":\"\",\"icon\":{\"type\":\"icon\",\"url\":\"https://www.youtube.com/yts/img/favicon\_144-vfliLAfaB.png\",\"width\":144,\"height\":144,\"aspectRatio\":1},\"thumbnail\":{\"type\":\"thumbnail\",\"url\":\"https://i.ytimg.com/vi/hblXdstrAg0/maxresdefault.jpg\",\"width\":1280,\"height\":720,\"aspectRatio\":0.5625},\"embed\":{\"type\":\"player\",\"url\":\"https://www.youtube.com/embed/hblXdstrAg0?rel=0&showinfo=0\",\"html\":\"<div style=\\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.2493%;\\"><iframe src=\\"https://www.youtube.com/embed/hblXdstrAg0?rel=0&amp;showinfo=0\\" style=\\"border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;\\" allowfullscreen scrolling=\\"no\\"></iframe></div>\",\"aspectRatio\":1.7778}}" %}

