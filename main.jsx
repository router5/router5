import RouteNode from 'route-node'
import Router5 from './modules/Router5'
import React from 'react'

let userRoutes = new RouteNode('users', '/users', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('list', '/list')
])

let ordersRoute = new RouteNode('orders', '/orders', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('pending', '/pending'),
    new RouteNode('completed', '/completed')
])

console.log('will construct');
let router = new Router5([
    userRoutes,
    ordersRoute,
    new RouteNode('home', '/home')
], {
    defaultRoute: 'home',
    useHash: true
})

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

let Hello = React.createClass({
  getInitialState: function () {
    return {state: router.getState()}
  },

  onStateChange: function (newState, oldState) {
    this.setState({
        state: newState
    })
  },

  componentDidMount: function () {
    router.addListener(this.onStateChange)
  },

  componentWillUnmount: function () {
    router.removeListener(this.onStateChange)
  },

  render: function() {
    if (this.state.state) {
        let stateName = this.state.state.name
        return <div key="1">Hello {stateName}</div>
    }
  }
});

React.render(<Hello />, document.getElementById('app'));
