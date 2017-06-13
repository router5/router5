import { expect } from 'chai';
import { constants, errorCodes } from '../../modules';
import createTestRouter from '../_create-router';
import { omitMeta } from '../_helpers';
import sinon, { spy } from 'sinon';

const noop = () => {};

describe('core/navigation', function() {
    let router, sandbox;

    before(() => (router = createTestRouter().clone().start()));
    after(() => router.stop());

    afterEach(() => sandbox.restore());
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    it('should be able to navigate to routes', function(done) {
        router.navigate('users.view', { id: 123 }, {}, function(err, state) {
            expect(omitMeta(state)).to.eql({
                name: 'users.view',
                params: { id: 123 },
                path: '/users/view/123'
            });
            done();
        });
    });

    it('should return an error if trying to navigate to an unknown route', function(
        done
    ) {
        router.navigate('fake.route', function(err, state) {
            expect(err.code).to.equal(errorCodes.ROUTE_NOT_FOUND);
            done();
        });
    });

    it('should navigate to same state if reload is set to true', function(
        done
    ) {
        router.navigate('orders.pending', function(err, state) {
            router.navigate('orders.pending', function(err, state) {
                expect(err.code).to.equal(errorCodes.SAME_STATES);

                router.navigate(
                    'orders.pending',
                    {},
                    { reload: true },
                    function(err, state) {
                        expect(err).to.equal(null);
                        done();
                    }
                );
            });
        });
    });

    it('should be able to cancel a transition', function(done) {
        router.canActivate('admin', () => () => Promise.resolve());
        const cancel = router.navigate('admin', function(err) {
            expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
            done();
        });
        cancel();
    });

    it('should be able to handle multiple cancellations', function(done) {
        router.useMiddleware(router => (toState, fromState, done) => {
            setTimeout(done, 20);
        });
        const cancel = router.navigate('users', (err, state) => {
            expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
        });
        spy(cancel);
        const cancel2 = router.navigate('users', (err, state) => {
            expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
        });
        spy(cancel2);
        const cancel3 = router.navigate('users', (err, state) => {
            expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
        });
        spy(cancel3);
        const cancel4 = router.navigate('users', (err, state) => {
            router.clearMiddleware();
            done();
        });
        spy(cancel4);

        expect(cancel).to.have.beenCalled;
        expect(cancel2).to.have.beenCalled;
        expect(cancel3).to.have.beenCalled;
        expect(cancel4).to.not.have.beenCalled;
    });

    it('should redirect if specified by transition error, and call back', function(
        done
    ) {
        router.stop();
        router.start('/auth-protected', (err, state) => {
            expect(omitMeta(state)).to.eql({
                name: 'sign-in',
                params: {},
                path: '/sign-in'
            });
            router.navigate('auth-protected', (err, state) => {
                expect(omitMeta(state)).to.eql({
                    name: 'sign-in',
                    params: {},
                    path: '/sign-in'
                });
                done();
            });
        });
    });

    it('should pass along handled errors in promises', function(done) {
        router.clearMiddleware();
        router.stop();
        router.canActivate('admin', () => () =>
            Promise.resolve(new Error('error message'))
        );
        router.start('', () => {
            router.navigate('admin', function(err) {
                expect(err.code).to.equal(errorCodes.CANNOT_ACTIVATE);
                expect(err.error.message).to.equal('error message');
                done();
            });
        });
    });

    it('should pass along handled errors in promises', function(done) {
        sandbox.stub(console, 'error', noop);
        router.stop();
        router.canActivate('admin', () => () =>
            new Promise((resolve, reject) => {
                throw new Error('unhandled error');
            })
        );
        router.start('', () => {
            router.navigate('admin', function(err) {
                expect(err.code).to.equal(errorCodes.CANNOT_ACTIVATE);
                expect(console.error).to.have.been.called;
                done();
            });
        });
    });

    it('should prioritise cancellation errors', function(done) {
        router.stop();
        router.canActivate('admin', () => () =>
            new Promise((resolve, reject) => {
                setTimeout(() => reject(), 20);
            })
        );
        router.start('', () => {
            const cancel = router.navigate('admin', function(err) {
                expect(err.code).to.equal(errorCodes.TRANSITION_CANCELLED);
                done();
            });
            setTimeout(cancel, 10);
        });
    });

    it('should let users navigate to unkown URLs if allowNotFound is set to true', done => {
        router.setOption('allowNotFound', true);
        router.setOption('defaultRoute', undefined);
        router.stop();
        router.start('/unkown-url', (err, state) => {
            expect(state.name).to.equal(constants.UNKNOWN_ROUTE);
            done();
        });
    });
});
