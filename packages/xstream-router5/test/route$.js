import { expect } from 'chai';
import { spy } from 'sinon';
import { state1, state2, state3 } from './_helpers';
import createObservables from '../modules';
import createRouter, { constants } from '../../router5';

describe('route$', () => {
    it('should push new values to route$ on transitionSuccess events', () => {
        const router = createRouter();
        const observables = createObservables(router);
        const listener = { next: spy(), error() {}, complete: spy() };

        observables.route$.addListener(listener);
        expect(listener.next).to.have.been.calledWith(null);

        router.invokeEventListeners(constants.TRANSITION_START, state1, null);
        router.invokeEventListeners(constants.TRANSITION_SUCCESS, state1, null);

        expect(listener.next).to.have.been.calledWith(state1);

        router.invokeEventListeners(constants.TRANSITION_START, state2, state1);
        router.invokeEventListeners(
            constants.TRANSITION_SUCCESS,
            state2,
            state1
        );

        expect(listener.next).to.have.been.calledWith(state2);

        router.invokeEventListeners(constants.TRANSITION_START, state3, state2);
        router.invokeEventListeners(
            constants.TRANSITION_SUCCESS,
            state3,
            state2
        );

        expect(listener.next).to.have.been.calledWith(state3);

        router.invokeEventListeners(constants.ROUTER_STOP);

        expect(listener.complete).to.have.been.called;
    });

    it('should not push new values to route$ on transitionError events', () => {
        const router = createRouter();
        const observables = createObservables(router);
        const listener = { next: spy(), error() {}, complete() {} };

        observables.route$.addListener(listener);
        router.invokeEventListeners(constants.TRANSITION_START, state1, null);
        router.invokeEventListeners(constants.TRANSITION_ERROR, state1, null);

        expect(listener.next).to.have.been.calledOnce;
        expect(listener.next).to.have.been.calledWith(null);

        router.invokeEventListeners(constants.ROUTER_STOP);
    });
});
