var router = null;

var listeners = {
    global: function (newState, oldState) {
        console.log('From listener');
        return;
    },
    node: function (newState, oldState) {
        return;
    }
};

var userRoutes = new RouteNode('users', '/users', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('list', '/list')
]);

var ordersRoute = new RouteNode('orders', '/orders', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('pending', '/pending'),
    new RouteNode('completed', '/completed')
]);

router = new Router5([
        userRoutes,
        ordersRoute,
    ], {
        defaultRoute: 'home',
        useHash: true
    })
    .add(new RouteNode('home', '/home'));

describe('router5', function () {
    it('should throw an error if Router5 is not used as a constructor', function () {
        expect(function () { Router5([]); }).toThrow();
    });

    it('should start with the default route', function () {
        expect(window.location.hash).toBe('');
        expect(router.getState()).toEqual(null)

        // Starting twice shouldn't do anything
        router.start().start();
        expect(router.started).toBe(true);

        expect(window.location.hash).toBe('#/home');
        expect(router.getState()).toEqual({name: 'home', params: {}, path: '/home'});
    });

    it('should expose RouteNode path building function', function () {
        expect(router.buildPath('users.list')).toBe('/users/list');
    });

    it('should be able to navigate to routes', function () {
        router.navigate('users.view', {id: 123});

        expect(window.location.hash).toBe('#/users/view/123');
    });

    it('should throw an error if trying to navigate to an unknown route', function () {
        expect(function () { router.navigate('fake.route'); }).toThrow();
    });

    it('should invoke listeners on navigation', function () {
        // Removing a listener not added should not throw an error
        router.removeListener(listeners.global);

        router.navigate('home');
        var previousState = router.lastKnownState;

        spyOn(listeners, 'global');
        router.addListener(listeners.global);

        router.navigate('orders.pending');
        expect(window.location.hash).toBe('#/orders/pending');
        expect(listeners.global).toHaveBeenCalledWith(router.lastKnownState, previousState);
        router.removeListener(listeners.global);
    });

    it('should invoke listeners on navigation to same state if reload is set to true', function () {
        spyOn(listeners, 'global');
        router.addListener(listeners.global);

        router.navigate('orders.pending');
        expect(listeners.global).not.toHaveBeenCalled();

        router.navigate('orders.pending', {}, {reload: true});
        expect(listeners.global).toHaveBeenCalled();
    });

    it('should handle popstate events', function () {
        var homeState = {name: 'home', params: {}, path: '/home'};
        var evt = new Event('popstate');
        window.dispatchEvent(evt);
        expect(router.getState()).not.toEqual(homeState);

        evt.state = homeState;
        window.dispatchEvent(evt);

        expect(router.getState()).toEqual(homeState);
        // Nothing will happen
        window.dispatchEvent(evt);
    });

    it('should be able to remove listeners', function () {
        router.removeListener(listeners.global);
        spyOn(listeners, 'global');

        router.navigate('orders.view', {id: 123}, {replace: true});
        expect(listeners.global).not.toHaveBeenCalled();
    });

    it('should not invoke listeners if trying to navigate to the current route', function () {
        spyOn(listeners, 'global');
        router.addListener(listeners.global);

        router.navigate('orders.view', {id: 123});
        expect(listeners.global).not.toHaveBeenCalled();

        router.removeListener(listeners.global);
    });

    it('should be able to stop routing', function () {
        router.navigate('orders.pending');
        router.stop();
        expect(router.started).toBe(false);
        router.navigate('users.list');
        expect(window.location.hash).toBe('#/orders/pending');
        // Stopping again shouldn't throw an error
        router.stop();
    });

    it('should not start with default route if current path matches an existing route', function () {
        router.start();
        expect(window.location.hash).toBe('#/orders/pending');
    });

    it('should invoke node listeners', function () {
        router.navigate('users.list');
        spyOn(listeners, 'node');
        router.addNodeListener('users', listeners.node);
        router.navigate('users.view', {id: 1});
        expect(listeners.node).toHaveBeenCalled();
        router.removeNodeListener('users', listeners.node);
    });

    it('should warn when trying to register a listener on a non-existing node', function () {
        spyOn(console, 'warn');
        router.addNodeListener('fake.node', listeners.node);
        expect(console.warn).toHaveBeenCalled();
        router.removeNodeListener('fake.node', listeners.node);
        // Removing twice shouldn't throw an error
        router.removeNodeListener('fake.node', listeners.node);
    });

    it('should be able to register components', function () {
        router.registerComponent('users.view', {});
        expect(Object.keys(router.activeComponents).length).toBe(1);

        router.registerComponent('users.list', {});
        expect(Object.keys(router.activeComponents).length).toBe(2);

        router.deregisterComponent('users.list');
        expect(Object.keys(router.activeComponents).length).toBe(1);

        router.deregisterComponent('users.view');
        expect(Object.keys(router.activeComponents).length).toBe(0);
    });

    it('should block navigation if a component refuses deactivation', function () {
        router.navigate('users.list');

        // Cannot deactivate
        router.registerComponent('users.list', {
            canDeactivate: function () {
                return false;
            }
        });
        router.navigate('users');
        expect(window.location.hash).toBe('#/users/list');

        // Can deactivate
        router.deregisterComponent('users.list');
        router.registerComponent('users.list', {
            canDeactivate: function () {
                return true;
            }
        });
        router.navigate('users');
        expect(window.location.hash).toBe('#/users');
    });

    it('should warn when trying to register a component twice', function () {
        spyOn(console, 'warn');
        router.registerComponent('users.view', {});
        router.registerComponent('users.view', {});
        expect(console.warn).toHaveBeenCalled();
    });
});

