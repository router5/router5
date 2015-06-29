import RouteNode from 'route-node'
import Router5 from './modules/Router5'

let userRoutes = new RouteNode('users', '/users', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('list', '/list')
])

let router = new Router5([
    userRoutes
])

let listener = (newState, oldState) => console.log(newState, oldState)
router.addListener(listener)

document.getElementById('users').addEventListener('click', evt => {
    evt.preventDefault()
    router.navigate('users')
}, false)

document.getElementById('users.view').addEventListener('click', evt => {
    evt.preventDefault()
    router.navigate('users.view', {id: 123})
}, false)

document.getElementById('users.list').addEventListener('click', evt => {
    evt.preventDefault()
    router.navigate('users.list')
}, false)
