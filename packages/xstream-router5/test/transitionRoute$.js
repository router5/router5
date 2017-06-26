import { expect } from 'chai';
import { spy } from 'sinon';
import { state1 } from './_helpers';
import createObservables from '../modules';
import createRouter, { constants } from '../../router5';

describe('transitionRoute$', () => {
    it('should push new values to transitionRoute$ on transitionStart events', () => {
        const router = createRouter();
        const observables = createObservables(router);
        const listener = { next: spy(), error() {}, complete: spy() };

        observables.transitionRoute$.addListener(listener);
        router.invokeEventListeners(constants.TRANSITION_START, state1, null);

        expect(listener.next).to.have.been.calledTwice;
        expect(listener.next).to.have.been.calledWith(null);
        expect(listener.next).to.have.been.calledWith(state1);

        router.invokeEventListeners(constants.ROUTER_STOP);

        expect(listener.complete).to.have.been.called;
    });

    it('should become null on a transition success', () => {
        const router = createRouter();
        const observables = createObservables(router);
        const listener = { next: spy(), error() {}, complete() {} };

        observables.transitionRoute$.addListener(listener);
        router.invokeEventListeners(constants.TRANSITION_START, state1, null);
        router.invokeEventListeners(constants.TRANSITION_SUCCESS, state1, null);

        expect(listener.next).to.have.been.calledThrice;
        expect(listener.next).to.have.been.calledWith(null);
        expect(listener.next).to.have.been.calledWith(state1);
        expect(listener.next).to.have.been.calledWith(null);

        router.invokeEventListeners(constants.ROUTER_STOP);
    });

    it('should become null on a transition error', () => {
        const router = createRouter();
        const observables = createObservables(router);
        const listener = { next: spy(), error() {}, complete() {} };

        observables.transitionRoute$.addListener(listener);
        router.invokeEventListeners(constants.TRANSITION_START, state1, null);
        router.invokeEventListeners(constants.TRANSITION_ERROR, state1, null);

        expect(listener.next).to.have.been.calledThrice;
        expect(listener.next).to.have.been.calledWith(null);
        expect(listener.next).to.have.been.calledWith(state1);
        expect(listener.next).to.have.been.calledWith(null);

        router.invokeEventListeners(constants.ROUTER_STOP);
    });
});
