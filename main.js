import RouteNode from 'route-node'
import Router5 from './modules/Router5'

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
    ordersRoute
])

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
        evt.preventDefault()
        console.log(button.attributes, button.getAttribute('params'));
        router.navigate(button.getAttribute('id'), JSON.parse(button.getAttribute('params') || '{}'))
    }, false)
})
