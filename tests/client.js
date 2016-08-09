import { expect } from 'chai';
import sinon, { spy } from 'sinon';
import createRouter, { constants, errorCodes } from '../modules';
import createTestRouter from './_create-router';

const noop = () => {};

const listeners = {
    transition: (toState, fromState, done) => {
        const newState = {
            name: toState.name,
            params: toState.params,
            path: toState.path,
            hitMware: true
        };
        done(null, newState);
    },
    transitionMutate: (toState, fromState, done) => {
        const newState = {
            name: toState.name + 'modified',
            params: toState.params,
            path: toState.path,
            hitMware: true
        };
        done(null, newState);
    },
    transitionErr: (toState, fromState, done) => {
        done({ reason: 'because' });
    },
    noop() {}
};

const myPlugin = router => {
    router.myCustomMethod = function () {};

    return {
        onTransitionStart: function onTransitionStart() {},
        onTransitionSuccess: function onTransitionSuccess() {},
        onTransitionError: function onTransitionError() {}
    };
};
myPlugin.pluginName = 'PLUGIN_NAME';

const base = window.location.pathname;

const hashPrefix = '!';

function getExpectedPath(useHash, path) {
    return useHash ? '#' + hashPrefix + path : path;
}

function omitMeta(obj) {
    if (!obj._meta) {
        console.log('no meta');
    }
    return {
        name: obj.name,
        params: obj.params,
        path: obj.path
    };
}

describe('router5', function () {
    // Without hash
    testRouter(false);

    // With hash
    testRouter(true);
});

function testRouter(useHash) {
    describe(useHash ? 'with using URL hash part' : 'without using URL hash part', () => {
        let router, sandbox;

        before(() => router = createTestRouter(base, useHash, hashPrefix));
        after(() => router.stop());

        afterEach(() => sandbox.restore());
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            router._cbs = {};
        });

        function makeUrl(path) {
            return 'https://www.mysite.com:8080' + base + (useHash ? '#' + hashPrefix : '' ) + path;
        }

        it('should expose RouteNode path building function', function () {
            expect(router.buildPath('users.list')).to.equal('/users/list');
        });

        it('should buildUrl', function () {
            expect(router.buildUrl('users.list')).to.equal(base + getExpectedPath(useHash, '/users/list'));
            expect(router.buildUrl('users.view', {id: 1})).to.equal(base + getExpectedPath(useHash, '/users/view/1'));
        });

        it('should be able to extract the path of an URL', function () {
            expect(router.urlToPath(makeUrl('/home'))).to.equal('/home');
            expect(() => router.urlToPath('')).to.throw();
        });

        it('should match an URL', function () {
            expect(omitMeta(router.matchUrl(makeUrl('/home')))).to.eql({name: 'home', params: {}, path: '/home'});
            expect(omitMeta(router.matchUrl(makeUrl('/users/view/1')))).to.eql({name: 'users.view', params: {id: '1'}, path: '/users/view/1'});
        });

        it('should start with the default route', function (done) {
            expect(router.getState()).to.equal(null);
            expect(router.isActive('home')).to.equal(false);

            router.start('', function () {
                expect(router.isStarted()).to.equal(true);
                expect(omitMeta(router.getState())).to.eql({name: 'home', params: {}, path: '/home'});
                done();
            });
        });

        it('should not throw an error when starting with no callback', function() {
            router.stop();
            expect(() => router.start()).not.to.throw();
        });

        it('should give an error if trying to start when already started', function (done) {
            router.start('', function (err) {
                expect(err.code).to.equal(errorCodes.ROUTER_ALREADY_STARTED);
                done();
            });
        });

        it('should start with the start route if matched', function (done) {
            router.stop();
            router.start('/section123/query?param1[]=1__1&param1[]=2__2', function (err, state) {
                expect(omitMeta(state)).to.eql({
                    name: 'section.query',
                    params: {section: 'section123', param1: [ '1__1', '2__2']},
                    path: '/section123/query?param1[]=1__1&param1[]=2__2'
                });
                done();
            });
        });

        it('should start with the default route if start route is not matched', function (done) {
            router.stop();
            router.start('/about', function (err, state) {
                expect(omitMeta(router.getState())).to.eql({name: 'home', params: {}, path: '/home'});
                done();
            });
        });

        it('should start with the default route if navigation to start route is not allowed', function (done) {
            router.stop();
            router.start('/admin', function () {
                expect(omitMeta(router.getState())).to.eql({name: 'home', params: {}, path: '/home'});
                done();
            });
        });

        it('should start with an error if navigation to start route is not allowed and no default route is specified', function (done) {
            router.stop();
            router.setOption('defaultRoute', null);
            router.start('/admin', function (err) {
                expect(err.code).to.equal(errorCodes.CANNOT_ACTIVATE);
                expect(err.segment).to.equal('admin');
                done();
            });
        });

        it('should start with a not found error if no matched start state and no default route', function (done) {
            router.stop();
            router.setOption('defaultRoute', null);
            router.start('', function (err) {
                expect(err.code).to.equal(errorCodes.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should not match an URL with extra trailing slashes', function (done) {
            router.stop();
            router.start('/users/list/', function (err, state) {
                expect(err.code).to.equal(errorCodes.ROUTE_NOT_FOUND);
                expect(state).to.equal(null);
                done();
            });
        });

        it('should match an URL with extra trailing slashes', function (done) {
            router.setOption('trailingSlash', 1);
            router.stop();
            router.start('/users/list/', function (err, state) {
                expect(omitMeta(state)).to.eql({name: 'users.list', params: {}, path: '/users/list/'});
                router.setOption('trailingSlash', 0);
                done();
            });
        });

        it('should match an URL with extra trailing slashes', function (done) {
            router.setOption('trailingSlash', 1);
            router.stop();
            router.start('/users/list/', function (err, state) {
                expect(omitMeta(state)).to.eql({name: 'users.list', params: {}, path: '/users/list/'});
                router.setOption('trailingSlash', 0);
                done();
            });
        });

        it('should start with the provided state', function (done) {
            router.stop();
            var homeState = {name: 'home', params: {}, path: '/home', _meta: {'home': {}}};
            router.start(homeState, function (err, state) {
                expect(state).to.eql(homeState);
                expect(router.getState()).to.eql(homeState);
                done();
            });
        });

        it('should return an error if default route access is not found', function (done) {
            router.stop();
            router.setOption('defaultRoute', 'fake.route');

            router.start('', function(err, state) {
                expect(err.code).to.equal(errorCodes.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should be able to navigate to routes', function (done) {
            router.navigate('users.view', {id: 123}, {}, function (err, state) {
                expect(omitMeta(state)).to.eql({name: 'users.view', params: {id: 123}, path: '/users/view/123'});
                done();
            });
        });

        it('should return an error if trying to navigate to an unknown route', function (done) {
            router.navigate('fake.route', {}, {}, function (err, state) {
                expect(err.code).to.equal(errorCodes.ROUTE_NOT_FOUND);
                done();
            });
        });

        it('should navigate to same state if reload is set to true', function (done) {
            router.navigate('orders.pending', {}, {}, function (err, state) {
                router.navigate('orders.pending', {}, {}, function (err, state) {
                    expect(err.code).to.equal(errorCodes.SAME_STATES);

                    router.navigate('orders.pending', {}, {reload: true}, function (err, state) {
                        expect(err).to.equal(null);
                        done();
                    });
                });
            });
        });

        it('should be able to stop routing', function (done) {
            router.navigate('users', {}, {}, function () {
                router.stop();
                expect(router.isStarted()).to.equal(false);
                router.navigate('users.list', {}, {}, function (err) {
                    expect(err.code).to.equal(errorCodes.ROUTER_NOT_STARTED);
                    // Stopping again shouldn't throw an error
                    router.stop();
                    router.start('', () => done());
                });
            });
        });

        // it('should not start with default route if current path matches an existing route', function (done) {
        //     router.start(function (err, state) {
        //         expect(router.getState()).to.eql({name: 'orders.pending', params: {}, path: '/orders/pending'});
        //         done();
        //     });
        // });

        it('should block navigation if a component refuses deactivation', function (done) {
            router.navigate('users.list', {}, {}, function () {
                // Cannot deactivate
                router.canDeactivate('users.list', () => () => Promise.reject());
                router.navigate('users', {}, {}, function (err) {
                    expect(err.code).to.equal(errorCodes.CANNOT_DEACTIVATE);
                    expect(err.segment).to.equal('users.list');
                    expect(omitMeta(router.getState())).to.eql({name: 'users.list', params: {}, path: '/users/list'});

                    // Can deactivate
                    router.canDeactivate('users.list', true);
                    router.navigate('users', {}, {}, function () {
                        expect(omitMeta(router.getState())).to.eql({name: 'users', params: {}, path: '/users'});
                        // Auto clean up
                        expect(router.getLifecycleFunctions()[0]['users.list']).to.equal(undefined);
                        done();
                    });
                });
            });
        });

        it('should register can deactivate status', function (done) {
            router.navigate('users.list', {}, {}, function (err) {
                router.canDeactivate('users.list', false);
                router.navigate('users', {}, {}, function (err) {
                    expect(err.code).to.equal(errorCodes.CANNOT_DEACTIVATE);
                    expect(err.segment).to.equal('users.list');
                    router.canDeactivate('users.list', true);
                    router.navigate('users', {}, {}, function (err) {
                        expect(err).to.equal(null);
                        done();
                    });
                });
            });
        });

        it('should tell if a route is active or not', function () {
            router.navigate('users.view', {id: 1});
            expect(router.isActive('users.view', {id: 1})).to.equal(true);
            expect(router.isActive('users.view', {id: 2})).to.equal(false);
            expect(router.isActive('users.view')).to.equal(false);
            expect(router.isActive('users')).to.equal(true);
            expect(router.isActive('users', {}, true)).to.equal(false);

            router.navigate('section.query', {section: 'section1'});
            expect(router.isActive('section', {section: 'section1'})).to.equal(true);
            expect(router.isActive('section.query', {section: 'section1', param1: '123'})).to.equal(true);
            expect(router.isActive('section.query', {section: 'section2'})).to.equal(false);
            expect(router.isActive('section.query', {section: 'section1', param2: '123'}, false, false)).to.equal(false);
            expect(router.isActive('users.view', {id: 123})).to.equal(false);
        });

        it('should block navigation if a route cannot be activated', function (done) {
            router.navigate('home', {}, {}, function () {
                router.navigate('admin', {}, {}, function (err) {
                    expect(err.code).to.equal(errorCodes.CANNOT_ACTIVATE);
                    expect(err.segment).to.equal('admin');
                    expect(router.isActive('home')).to.equal(true);
                    done();
                });
            });
        });

        it('should be able to cancel a transition', function (done) {
            router.canActivate('admin', () => () => Promise.resolve());
            const cancel = router.navigate('admin', {}, {}, function (err) {
                expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
                done();
            });
            cancel();
        });

        it('should be able to handle multiple cancellations', function (done) {
            router.useMiddleware((router) => (toState, fromState, done) => {
                setTimeout(done, 20);
            });
            const cancel = router.navigate('users', {}, {}, (err, state) => {
                expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
            });
            spy(cancel);
            const cancel2 = router.navigate('users', {}, {}, (err, state) => {
                expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
            });
            spy(cancel2);
            const cancel3 = router.navigate('users', {}, {}, (err, state) => {
                expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
            });
            spy(cancel3);
            const cancel4 = router.navigate('users', {}, {}, (err, state) => {
                router.clearMiddleware();
                done();
            });
            spy(cancel4);

            expect(cancel).to.have.beenCalled;
            expect(cancel2).to.have.beenCalled;
            expect(cancel3).to.have.beenCalled;
            expect(cancel4).to.not.have.beenCalled;
        });

        it('should register plugins', function (done) {
            router.stop();
            router.usePlugin(myPlugin);
            expect(router.hasPlugin('PLUGIN_NAME'));
            router.start(() => {
                expect(router.myCustomMethod).not.to.equal(undefined);

                router.navigate('orders', {}, {}, function (err, state) {
                    // expect(myPlugin.onTransitionStart).to.have.been.called;
                    // expect(myPlugin.onTransitionSuccess).to.have.been.called;
                    done();
                });
            });
        });

        it('should support a transition middleware', function (done) {
            sandbox.spy(listeners, 'transition');
            router.stop();
            router.useMiddleware(() => listeners.transition);
            router.start(() => {
                router.navigate('users', {}, {}, function (err, state) {
                    expect(listeners.transition).to.have.been.called;
                    expect(state.hitMware).to.equal(true);
                    expect(err).to.equal(null);
                    done();
                });
            });
        });

        it('should refuse to mutate its state during a transition', function (done) {
            sandbox.stub(console, 'error');
            router.stop();
            router.useMiddleware(() => listeners.transitionMutate);
            router.start(() => {
                router.navigate('users', {}, {}, function (err, state) {
                    expect(console.error).to.have.been.called;
                    expect(err).to.equal(null);
                    done();
                });
            });
        });

        it('should fail transition if middleware returns an error', function (done) {
            sandbox.spy(listeners, 'transitionErr');
            router.stop();
            router.useMiddleware(() => listeners.transitionErr);
            router.start((err) => {
                router.navigate('users', {}, {}, function (err, state) {
                    expect(listeners.transitionErr).to.have.been.called;
                    expect(err.code).to.equal(errorCodes.TRANSITION_ERR);
                    expect(err.reason).to.equal('because');
                    done();
                });
            });
        });

        it('should be able to take more than one middleware', function (done) {
            sandbox.spy(listeners, 'transition');
            sandbox.spy(listeners, 'transitionErr');
            router.stop();
            router.useMiddleware(() => listeners.transition, () => listeners.transitionErr);
            router.start((err, state) => {
                router.navigate('users', {}, {}, function (err, state) {
                    expect(listeners.transition).to.have.been.called;
                    expect(listeners.transitionErr).to.have.been.called;
                    done();
                });
            });
        });

        it('should be able to set additional arguments for lifecycle methods', function () {
            const a = 1;
            const b = 2;
            const mware = spy(() => () => true);
            router.stop();
            router.useMiddleware(mware);
            router.inject(a, b);
            router.start(() => {
                router.navigate('users', {}, {}, () => {
                    expect(mware).to.have.been.calledWith(router, a, b);
                });
            });
        });

        it('should pass along handled errors in promises', function (done) {
            router.clearMiddleware();
            router.stop();
            router.canActivate('admin', () => () => Promise.resolve(new Error('error message')));
            router.start(() => {
                router.navigate('admin', {}, {}, function (err) {
                    expect(err.code).to.equal(errorCodes.CANNOT_ACTIVATE);
                    expect(err.error.message).to.equal('error message');
                    done();
                });
            });
        });

        it('should pass along handled errors in promises', function (done) {
            sandbox.stub(console, 'error', noop);
            router.stop();
            router.canActivate('admin', () => () => new Promise((resolve, reject) => {
                throw new Error('unhandled error');
            }));
            router.start(() => {
                router.navigate('admin', {}, {}, function (err) {
                    expect(err.code).to.equal(errorCodes.CANNOT_ACTIVATE);
                    expect(console.error).to.have.been.called;
                    done();
                });
            });
        });

        it('should prioritise cancellation errors', function (done) {
            router.stop();
            router.canActivate('admin', () => () => new Promise((resolve, reject) => {
                setTimeout(() => reject(), 20);
            }));
            router.start(() => {
                const cancel = router.navigate('admin', {}, {}, function (err) {
                    expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
                    done();
                });
                setTimeout(cancel, 10);
            });
        });

        it('should redirect if specified by transition error, and call back', function (done) {
            router.stop();
            router.start('/auth-protected', (err, state) => {
                expect(omitMeta(state)).to.eql({
                    name: 'sign-in',
                    params: {},
                    path: '/sign-in'
                });
                router.navigate('auth-protected', {}, {}, (err, state) => {
                    expect(omitMeta(state)).to.eql({
                        name: 'sign-in',
                        params: {},
                        path: '/sign-in'
                    });
                    done();
                });
            });
        });

        it('should force deactivation if specified as a transition option', (done) => {
            router.navigate('orders.view', {id: '1'}, {}, (err, state) => {
                router.canDeactivate('orders.view', false);
                router.navigate('home', {}, {}, (err, state) => {
                    expect(err.code).to.equal(errorCodes.CANNOT_DEACTIVATE);
                    router.navigate('home', {}, {forceDeactivate: true}, (err, state) => {
                        expect(state.name).to.equal('home');
                        done();
                    });
                });
            });
        });

        it('should let users navigate to unkown URLs if allowNotFound is set to true', (done) => {
            router.setOption('allowNotFound', true);
            router.setOption('defaultRoute', undefined);
            router.stop();
            router.start('/unkown-url', (err, state) => {
                expect(state.name).to.equal(constants.UNKNOWN_ROUTE);
                done();
            });
        });
    });
}
