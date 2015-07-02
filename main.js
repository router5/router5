import RouteNode from 'route-node'
import Router5 from './modules/Router5'
// import React from 'react'

let userRoutes = new RouteNode('users', '/users', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('list', '/list')
])

let ordersRoute = new RouteNode('orders', '/orders', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('pending', '/pending'),
    new RouteNode('completed', '/completed')
])

let router = new Router5([
    userRoutes,
    ordersRoute,
], {
    defaultRoute: 'home',
    useHash: true
}).add(new RouteNode('home', '/home')).start()

let listener = (newState, oldState) => {
    console.log('From:', oldState)
    console.log('To:', newState)
}

router.addListener(listener)
router.addNodeListener('users', function () {
    console.log('node users to be re-rendered');
});

Array.prototype.slice.call(document.querySelectorAll('button')).forEach(button => {
    button.addEventListener('click', evt => {
        router.navigate(button.getAttribute('id'), JSON.parse((button.getAttribute('params') || '{}').replace(/'/g, '"')))
    }, false)
})

// let Hello = React.createClass({
//   getInitialState: function () {
//     return {state: router.getState()}
//   },

//   onStateChange: function (newState, oldState) {
//     this.setState({
//         state: newState
//     })
//   },

//   componentDidMount: function () {
//     router.addListener(this.onStateChange)
//   },

//   componentWillUnmount: function () {
//     router.removeListener(this.onStateChange)
//   },

//   render: function() {
//     if (this.state.state) {
//         let stateName = this.state.state.name
//         return <div>Hello {stateName}</div>
//     }
//   }
// });

import deku from 'deku'
let tree = deku.tree
let render = deku.render
let element = deku.element
let renderString = deku.renderString

let onStateChange = (component, newState) => {
  component.setState({
      state: newState
  })
}

let Hello = {
  initialState (props) {
    return {state: router.getState()}
  },

  afterMount (component, prevProp, prevState, setState) {
    component.onStateChange = (newState, oldState) => {
      setState({
        state: newState
      })
    }

    router.addListener(component.onStateChange)
  },

  beforeUnmount (component, el) {
    router.removeListener(component.onStateChange)
  },

  render (component) {
    let {state} = component
    return element('div', {}, ['Hello ' + state.state.name])
  }
}

let app = tree(
  element(Hello, {})
)

render(app, document.getElementById('app'))

// export function render (component) {
//   let {props, state, id} = component;
//   return element('a', { class: "button", onClick: onClick }, [props.text])
// }


// React.render(<Hello />, document.getElementById('app'));
