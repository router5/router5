import { expect } from 'chai';
import createTestRouter from './_create-router';
import { spy } from 'sinon';

describe('router5', function() {
    let router;

    before(() => (router = createTestRouter().clone().start()));
    after(() => router.stop());

    // it('should not start with default route if current path matches an existing route', function (done) {
    //     router.start(function (err, state) {
    //         expect(router.getState()).to.eql({name: 'orders.pending', params: {}, path: '/orders/pending'});
    //         done();
    //     });
    // });

    it('should be able to set additional arguments for lifecycle methods', function() {
        const a = 1;
        const b = 2;
        const mware = spy(() => () => true);
        router.useMiddleware(mware);
        router.setDependencies({ a, b });
        expect(mware).to.have.been.calledWith(router, { a, b });
    });
});
