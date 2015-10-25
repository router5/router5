var router = null;

var listeners = {
    transition: function (toState, fromState, done) {
        var newState = {
            name: toState.name,
            params: toState.params,
            path: toState.path,
            hitMware: true
        };
        expect(Object.keys(this)).toEqual(['cancel', 'router']);
        done(null, newState);
    },
    transitionMutate:  function (toState, fromState, done) {
        var newState = {
            name: toState.name + 'modified',
            params: toState.params,
            path: toState.path,
            hitMware: true
        }
        done(null, newState);
    },
    transitionErr: function (toState, fromState, done) {
        done(true);
    },
    noop: function () {}
};

var myPlugin = {
    name: 'PLUGIN_NAME',
    init: function (router) {
        router.myCustomMethod = function () {};
    },
    onTransitionStart: function onTransitionStart() {},
    onTransitionSuccess: function onTransitionSuccess() {},
    onTransitionError: function onTransitionError() {}
};

var myUnamedPlugin = {
    onTransitionStart: function onTransitionStart() {}
};

var base = window.location.pathname;

var hashPrefix = '!';

function getExpectedPath(useHash, path) {
    return useHash ? '#' + hashPrefix + path : path;
}

describe('router5', function () {
    // Without hash
    testRouter(false);

    // With hash
    testRouter(true);
});

function testRouter(useHash) {
    var router;

    beforeAll(function () {
        router = createRouter(base, useHash, hashPrefix);
    });

    afterAll(function () {
        router.stop();
    });

    describe(useHash ? 'with using URL hash part' : 'without using URL hash part', function () {
        function flushListeners() {
            router._cbs = {};
        }

        beforeEach(flushListeners);

        function makeUrl(path) {
            return 'https://www.mysite.com:8080' + base + (useHash ? '#' + hashPrefix : '' ) + path;
        }

        it('should throw an error if Router5 is not used as a constructor', function () {
            expect(function () { Router5([]); }).toThrow();
        });

        it('should expose RouteNode path building function', function () {
            expect(router.buildPath('users.list')).toBe('/users/list');
        });

        it('should buildUrl', function () {
            expect(router.buildUrl('users.list')).toBe(base + getExpectedPath(useHash, '/users/list'));
            expect(router.buildUrl('users.view', {id: 1})).toBe(base + getExpectedPath(useHash, '/users/view/1'));
        });

        it('should be able to extract the path of an URL', function () {
            expect(router.urlToPath(makeUrl('/home'))).toBe('/home');
            expect(function () {
                router.urlToPath('');
            }).toThrow();
        });

        it('should match an URL', function () {
            expect(router.matchUrl(makeUrl('/home'))).toEqual({name: 'home', params: {}, path: '/home'});
            expect(router.matchUrl(makeUrl('/users/view/1'))).toEqual({name: 'users.view', params: {id: '1'}, path: '/users/view/1'});
        });

        it('should start with the default route', function (done) {
            expect(router.getState()).toEqual(null)
            expect(router.isActive('home')).toEqual(false)

            router.start('', function () {
                expect(router.started).toBe(true);
                expect(router.getState()).toEqual({name: 'home', params: {}, path: '/home'});
                done();
            });
        });

        it('should give an error if trying to start when already started', function (done) {
            router.start('', function (err) {
                expect(err.code).toBe(Router5.ERR.ROUTER_ALREADY_STARTED);
                done();
            });
        });

        it('should start with the start route if matched', function (done) {
            router.stop();
            router.start('/users/view/123', function (err, state) {
                expect(state).toEqual({name: 'users.view', params: {id: '123'}, path: '/users/view/123'});
                done();
            });
        });

        it('should start with the default route if start route is not matched', function (done) {
            router.stop();
            router.lastKnownState = null;
            router.lastStateAttempt = null;
            router.start('/about', function (err, state) {
                expect(router.getState()).toEqual({name: 'home', params: {}, path: '/home'});
                done();
            });
        });

        it('should start with the default route if navigation to start route is not allowed', function (done) {
            router.stop();
            router.start('/admin', function (err) {
                expect(router.getState()).toEqual({name: 'home', params: {}, path: '/home'});
                done();
            });
        });

        it('should start with an error if navigation to start route is not allowed and no default route is specified', function (done) {
            router.stop();
            router.setOption('defaultRoute', null);
            router.start('/admin', function (err) {
                expect(err.code).toBe(Router5.ERR.CANNOT_ACTIVATE);
                expect(err.segment).toBe('admin');
                done();
            });
        });

        it('should start with a not found error if no matched start state and no default route', function (done) {
            router.stop();
            router.setOption('defaultRoute', null);
            router.start('', function (err) {
                expect(err.code).toBe(Router5.ERR.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should not match an URL with extra trailing slashes', function (done) {
            router.stop();
            router.start('/users/list/', function (err, state) {
                expect(err.code).toBe(Router5.ERR.ROUTE_NOT_FOUND);
                expect(state).toBe(null);
                done();
            });
        });

        it('should match an URL with extra trailing slashes', function (done) {
            router.setOption('trailingSlash', 1);
            router.stop();
            router.start('/users/list/', function (err, state) {
                expect(state).toEqual({name: 'users.list', params: {}, path: '/users/list/'});
                router.setOption('trailingSlash', 0);
                done();
            });
        });

        it('should match an URL with extra trailing slashes', function (done) {
            router.setOption('trailingSlash', 1);
            router.stop();
            router.start('/users/list/', function (err, state) {
                expect(state).toEqual({name: 'users.list', params: {}, path: '/users/list/'});
                router.setOption('trailingSlash', 0);
                done();
            });
        });

        it('should start with the provided state', function (done) {
            router.stop();
            var homeState = {name: 'home', params: {}, path: '/home'};
            router.start(homeState, function (err, state) {
                expect(state).toEqual(homeState);
                expect(router.lastKnownState).toEqual(homeState);
                done();
            });
        });

        it('should return an error if default route access is not found', function (done) {
            router.stop();
            router.setOption('defaultRoute', 'fake.route');

            router.start('', function(err, state) {
                expect(err.code).toBe(Router5.ERR.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should be able to navigate to routes', function (done) {
            router.navigate('users.view', {id: 123}, {}, function (err, state) {
                expect(state).toEqual({name: 'users.view', params: {id: 123}, path: '/users/view/123'});
                done();
            });
        });

        it('should return an error if trying to navigate to an unknown route', function (done) {
            router.navigate('fake.route', {}, {}, function (err, state) {
                expect(err.code).toBe(Router5.ERR.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should navigate to same state if reload is set to true', function (done) {
            router.navigate('orders.pending', {}, {}, function (err, state) {
                router.navigate('orders.pending', {}, {}, function (err, state) {
                    expect(err.code).toBe(Router5.ERR.SAME_STATES);

                    router.navigate('orders.pending', {}, {reload: true}, function (err, state) {
                        expect(err).toBe(null);
                        done();
                    });
                });
            });
        });

        it('should be able to stop routing', function (done) {
            router.navigate('users', {}, {}, function () {
                router.stop();
                expect(router.started).toBe(false);
                router.navigate('users.list', {}, {}, function (err) {
                    expect(err.code).toEqual(Router5.ERR.ROUTER_NOT_STARTED);
                    // Stopping again shouldn't throw an error
                    router.stop();
                    router.start('', done);
                });
            });
        });

        // it('should not start with default route if current path matches an existing route', function (done) {
        //     router.start(function (err, state) {
        //         expect(router.getState()).toEqual({name: 'orders.pending', params: {}, path: '/orders/pending'});
        //         done();
        //     });
        // });

        it('should be able to register components', function () {
            router.registerComponent('users.view', {});
            expect(router._cmps['users.view']).not.toBe(undefined);

            router.registerComponent('users.list', {});
            expect(router._cmps['users.list']).not.toBe(undefined);

            router.deregisterComponent('users.list');
            expect(router._cmps['users.list']).toBe(undefined);

            router.deregisterComponent('users.view');
            expect(router._cmps['users.view']).toBe(undefined);
        });

        it('should block navigation if a component refuses deactivation', function (done) {
            router.navigate('users.list', {}, {}, function () {
                // Cannot deactivate
                router.registerComponent('users.list', {
                    canDeactivate: function () {
                        return Promise.reject();
                    }
                });
                router.navigate('users', {}, {}, function (err) {
                    expect(err.code).toBe(Router5.ERR.CANNOT_DEACTIVATE);
                    expect(err.segment).toBe('users.list');
                    expect(router.getState()).toEqual({name: 'users.list', params: {}, path: '/users/list'});

                    // Can deactivate
                    router.deregisterComponent('users.list');
                    router.registerComponent('users.list', {
                        canDeactivate: function () {
                            return true;
                        }
                    });
                    router.navigate('users', {}, {}, function () {
                        expect(router.getState()).toEqual({name: 'users', params: {}, path: '/users'});
                        // Auto clean up
                        expect(router._cmps['users.list']).toBe(undefined);
                        done();
                    });
                });
            });
        });

        it('should register can deactivate status', function (done) {
            router.navigate('users.list', {}, {}, function (err) {
                router.canDeactivate('users.list', false);
                router.navigate('users', {}, {}, function (err) {
                    expect(err.code).toBe(Router5.ERR.CANNOT_DEACTIVATE);
                    expect(err.segment).toBe('users.list');
                    router.canDeactivate('users.list', true);
                    router.navigate('users', {}, {}, function (err) {
                        expect(err).toBe(null);
                        done();
                    });
                });
            });
        });

        it('should throw if trying to use canDeactivate with autoCleanUp to false', function () {
            router.setOption('autoCleanUp', false);
            expect(function () {
                router.canDeactivate('users.list', true);
            }).toThrow();
            router.setOption('autoCleanUp', true);
        });

        it('should warn when trying to register a component twice', function () {
            spyOn(console, 'warn');
            router.registerComponent('users.view', {});
            router.registerComponent('users.view', {});
            expect(console.warn).toHaveBeenCalled();
        });

        it('should tell if a route is active or not', function () {
            router.navigate('users.view', {id: 1});
            expect(router.isActive('users.view', {id: 1})).toBe(true);
            expect(router.isActive('users.view', {id: 2})).toBe(false);
            expect(router.isActive('users.view')).toBe(false);
            expect(router.isActive('users')).toBe(true);
            expect(router.isActive('users', {}, true)).toBe(false);

            router.navigate('section.query', {section: 'section1'});
            expect(router.isActive('section', {section: 'section1'})).toBe(true);
            expect(router.isActive('section.query', {section: 'section1', param1: '123'})).toBe(true);
            expect(router.isActive('section.query', {section: 'section2'})).toBe(false);
            expect(router.isActive('section.query', {section: 'section1', param2: '123'}, false, false)).toBe(false);
            expect(router.isActive('users.view', {id: 123})).toBe(false);
        });

        it('should block navigation if a route cannot be activated', function (done) {
            router.navigate('home', {}, {}, function () {
                router.navigate('admin', {}, {}, function (err) {
                    expect(err.code).toBe(Router5.ERR.CANNOT_ACTIVATE);
                    expect(err.segment).toBe('admin');
                    expect(router.isActive('home')).toBe(true);
                    done();
                });
            });
        });

        it('should be able to cancel a transition', function (done) {
            router.canActivate('admin', function canActivate(done) { return Promise.resolve(); });
            var cancel = router.navigate('admin', {}, {}, function (err) {
                expect(err.code).toBe(Router5.ERR.TRANSITION_CANCELLED);
                done();
            });
            cancel();
        });

        it('should register plugins', function () {
            router.usePlugin(myPlugin);
            expect(router.myCustomMethod).not.toBe(undefined);
            expect(router.registeredPlugins[myPlugin.name]).toEqual(myPlugin);

            router.navigate('orders', {}, {}, function (err, state) {
                // expect(myPlugin.onTransitionStart).toHaveBeenCalled();
                // expect(myPlugin.onTransitionSuccess).toHaveBeenCalled();
            });
        });

        it('should throw if a plugin has none of the expected methods', function () {
            expect(function () {
                spyOn(console, 'warn');
                router.usePlugin({});
            }).toThrow();
        });

        it('should warn when registering unamed plugins', function() {
            spyOn(console, 'warn');
            router.usePlugin(myUnamedPlugin);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should support a transition middleware', function (done) {
            spyOn(listeners, 'transition').and.callThrough();
            router.useMiddleware(listeners.transition);
            router.navigate('users', {}, {}, function (err, state) {
                expect(listeners.transition).toHaveBeenCalled();
                expect(state.hitMware).toBe(true);
                expect(err).toBe(null);
                done();
            });
        });

        it('should refuse to mutate its state during a transition', function (done) {
            spyOn(console, 'error').and.callThrough();
            router.useMiddleware(listeners.transitionMutate);
            router.navigate('orders', {}, {}, function (err, state) {
                expect(console.error).toHaveBeenCalled();
                expect(err).toBe(null);
                done();
            });
        });

        it('should fail transition if middleware returns an error', function (done) {
            spyOn(listeners, 'transitionErr').and.callThrough();
            router.useMiddleware(listeners.transitionErr);
            router.navigate('home', {}, {}, function (err, state) {
                expect(listeners.transitionErr).toHaveBeenCalled();
                expect(err.code).toBe(Router5.ERR.TRANSITION_ERR);
                done();
            });
        });

        it('should be able to take more than one middleware', function (done) {
            spyOn(listeners, 'transition').and.callThrough();
            spyOn(listeners, 'transitionErr').and.callThrough();
            router.useMiddleware(listeners.transition, listeners.transitionErr);
            router.navigate('home', {}, {}, function (err, state) {
                expect(listeners.transition).toHaveBeenCalled();
                expect(listeners.transitionErr).toHaveBeenCalled();
                done();
            });
        });
    });
}
