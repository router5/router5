var router = null;

var listeners = {
    transition: function (fromState, toState, done) {
        done(null);
    },
    transitionErr: function (fromState, toState, done) {
        done(true);
    },
    noop: function () {}
};

var base = window.location.pathname;

var hashPrefix = '!';

function getExpectedPath(useHash, path) {
    return useHash ? '#' + hashPrefix + path : path;
}

function getPath(useHash) {
    if (useHash) return window.location.hash + window.location.search;
    return window.location.pathname.replace(new RegExp('^' + base), '') + window.location.search;
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
        router = createRouter(base, useHash, hashPrefix)
    });

    afterAll(function () {
        router.stop();
        window.history.replaceState({}, '', base);
    });

    describe(useHash ? 'with using URL hash part' : 'without using URL hash part', function () {
        function flushListeners() {
            // router._cbs = {};
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

        it('should be able to extract the path of an URL', function () {
            expect(router.urlToPath(makeUrl('/home'))).toBe('/home');
        });

        it('should match an URL', function () {
            expect(router.matchUrl(makeUrl('/home'))).toEqual({name: 'home', params: {}, path: '/home'});
            expect(router.matchUrl(makeUrl('/users/view/1'))).toEqual({name: 'users.view', params: {id: '1'}, path: '/users/view/1'});
        });

        it('should start with the default route', function (done) {
            expect(getPath(useHash)).toBe('');
            expect(router.getState()).toEqual(null)
            expect(router.isActive('home')).toEqual(false)

            router.start(function () {
                expect(router.started).toBe(true);
                expect(getPath(useHash)).toBe(getExpectedPath(useHash, '/home'));
                expect(router.getState()).toEqual({name: 'home', params: {}, path: '/home'});
                done();
            });
        });

        it('should give an error if trying to start when already started', function (done) {
            router.start(function (err) {
                expect(err).toBe(Router5.ERR.ROUTER_ALREADY_STARTED);
                done();
            });
        });

        it('should start with the start route if matched', function (done) {
            router.stop();
            window.history.replaceState({}, '', base + getExpectedPath(useHash, '/users/view/123'));
            router.start(function (err, state) {
                expect(state).toEqual({name: 'users.view', params: {id: '123'}, path: '/users/view/123'});
                done();
            });
        });

        it('should start with the default route if start route is not matched', function (done) {
            router.stop();
            router.lastKnownState = null;
            router.lastStateAttempt = null;
            window.history.replaceState({}, '', base + getExpectedPath(useHash, '/about'));
            router.start(function () {
                expect(getPath(useHash)).toBe(getExpectedPath(useHash, '/home'));
                done();
            });
        });

        it('should start with the default route if navigation to start route is not allowed', function (done) {
            router.stop();
            window.history.replaceState({}, '', base + getExpectedPath(useHash, '/admin'));
            router.start(function (err) {
                expect(getPath(useHash)).toBe(getExpectedPath(useHash, '/home'));
                done();
            });
        });

        it('should start with an error if navigation to start route is not allowed and no default route is specified', function (done) {
            router.stop();
            router.setOption('defaultRoute', null);
            window.history.replaceState({}, '', base + getExpectedPath(useHash, '/admin'));
            router.start(function (err) {
                expect(err).toBe(Router5.ERR.CANNOT_ACTIVATE)
                done();
            });
        });

        it('should start with a not found error if no matched start state and no default route', function (done) {
            router.stop();
            router.setOption('defaultRoute', null);
            window.history.replaceState({}, '', base + getExpectedPath(useHash, ''));
            router.start(function (err) {
                expect(err).toBe(Router5.ERR.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should not match an URL with extra trailing slashes', function (done) {
            router.stop();
            window.history.replaceState({}, '', base + getExpectedPath(useHash, '/users/list/'));
            router.start(function (err, state) {
                expect(err).toBe(Router5.ERR.ROUTE_NOT_FOUND);
                expect(state).toBe(null);
                done();
            });
        });

        it('should match an URL with extra trailing slashes', function (done) {
            router.setOption('trailingSlash', 1);
            router.stop();
            window.history.replaceState({}, '', base + getExpectedPath(useHash, '/users/list/'));
            router.start(function (err, state) {
                expect(state).toEqual({name: 'users.list', params: {}, path: '/users/list/'});
                expect(router.getLocation()).toBe('/users/list');
                router.setOption('trailingSlash', 0);
                done();
            });
        });

        it('should match an URL with extra trailing slashes', function (done) {
            router.setOption('trailingSlash', 1);
            router.stop();
            window.history.replaceState({}, '', base + getExpectedPath(useHash, '/users/list/'));
            router.start(function (err, state) {
                expect(state).toEqual({name: 'users.list', params: {}, path: '/users/list/'});
                expect(router.getLocation()).toBe('/users/list');
                router.setOption('trailingSlash', 0);
                done();
            });
        });

        it('should start with the provided state', function (done) {
            router.stop();
            window.history.replaceState({}, '', base + getExpectedPath(useHash, '/home'));
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
            window.history.replaceState({}, '', base);

            router.start(function(err, state) {
                expect(err).toBe(Router5.ERR.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should be able to navigate to routes', function (done) {
            router.navigate('users.view', {id: 123}, {}, function (err) {
                expect(getPath(useHash)).toBe(getExpectedPath(useHash, '/users/view/123'));
                done();
            });
        });

        it('should return an error if trying to navigate to an unknown route', function (done) {
            router.navigate('fake.route', {}, {}, function (err, state) {
                expect(err).toBe(Router5.ERR.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should navigate to same state if reload is set to true', function (done) {
            router.navigate('orders.pending', {}, {}, function (err, state) {
                router.navigate('orders.pending', {}, {}, function (err, state) {
                    expect(err).toBe(Router5.ERR.SAME_STATES);

                    router.navigate('orders.pending', {}, {reload: true}, function (err, state) {
                        expect(err).toBe(null);
                        done();
                    });
                });
            });
        });

        it('should handle popstate events', function (done) {
            var homeState = {name: 'home', params: {}, path: '/home'};
            var evt = {};
            router.onPopState(evt);
            setTimeout(function () {
                expect(router.getState()).not.toEqual(homeState);

                evt.state = homeState;
                router.onPopState(evt);

                setTimeout(function () {
                    expect(router.getState()).toEqual(homeState);

                    router.navigate('users', {}, {}, function () {
                        router.registerComponent('users', {canDeactivate: function () { return false; }});
                        // Nothing will happen
                        router.onPopState(evt);
                        // Push to queue
                        setTimeout(function () {
                            expect(router.getState()).not.toEqual(homeState);
                            router.deregisterComponent('users');
                            done();
                        });
                    });
                });
            });
        });

        it('should be able to stop routing', function (done) {
            router.navigate('orders.pending', {}, {}, function () {
                router.stop();
                expect(router.started).toBe(false);
                router.navigate('users.list', {}, {}, function () {
                    expect(getPath(useHash)).toBe(getExpectedPath(useHash, '/orders/pending'));
                    // Stopping again shouldn't throw an error
                    router.stop();
                    done();
                });
            });
        });

        it('should not start with default route if current path matches an existing route', function (done) {
            router.start(function () {
                expect(getPath(useHash)).toBe(getExpectedPath(useHash, '/orders/pending'));
                done();
            });
        });

        it('should be able to register components', function () {
            router.registerComponent('users.view', {});
            expect(Object.keys(router._cmps).length).toBe(1);

            router.registerComponent('users.list', {});
            expect(Object.keys(router._cmps).length).toBe(2);

            router.deregisterComponent('users.list');
            expect(Object.keys(router._cmps).length).toBe(1);

            router.deregisterComponent('users.view');
            expect(Object.keys(router._cmps).length).toBe(0);
        });

        it('should block navigation if a component refuses deactivation', function (done) {
            router.navigate('users.list', {}, {}, function () {
                // Cannot deactivate
                router.registerComponent('users.list', {
                    canDeactivate: function () {
                        return Promise.reject();
                    }
                });
                router.navigate('users', {}, {}, function () {
                    expect(getPath(useHash)).toBe(getExpectedPath(useHash, '/users/list'));

                    // Can deactivate
                    router.deregisterComponent('users.list');
                    router.registerComponent('users.list', {
                        canDeactivate: function () {
                            return true;
                        }
                    });
                    router.navigate('users', {}, {}, function () {
                        expect(getPath(useHash)).toBe(getExpectedPath(useHash, '/users'));
                        done();
                    });
                });
            });
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
                expect(err).toBe(Router5.ERR.CANNOT_ACTIVATE);
                    expect(router.isActive('home')).toBe(true);
                    done();
                });
            });
        });

        it('should be able to cancel a transition', function (done) {
            router.canActivate('admin', function canActivate(done) { return Promise.resolve(); });
            var cancel = router.navigate('admin', {}, {}, function (err) {
                expect(err).toBe(Router5.ERR.TRANSITION_CANCELLED);
                done();
            });
            cancel();
        });

        it('should support a transition middleware', function (done) {
            spyOn(listeners, 'transition').and.callThrough();
            router.onTransition(listeners.transition);
            router.navigate('users', {}, {}, function (err, state) {
                expect(listeners.transition).toHaveBeenCalled();
                expect(err).toBe(null);
                done();
            });
        });

        it('should fail transition if middleware returns an error', function (done) {
            spyOn(listeners, 'transitionErr').and.callThrough();
            router.onTransition(listeners.transitionErr);
            router.navigate('home', {}, {}, function (err, state) {
                expect(listeners.transitionErr).toHaveBeenCalled();
                expect(err).toBe(Router5.ERR.TRANSITION_ERR);
                done();
            });
        });
    });
}
