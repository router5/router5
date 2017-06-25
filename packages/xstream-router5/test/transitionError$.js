import { expect } from 'chai';
import { spy } from 'sinon';
import { state1, state2 } from './_helpers';
import createObservables from '../modules';
import createRouter, { constants } from 'router5';

const error = 'error';

describe('transitionError$', () => {
    it('should push new values to transitionError$ on transitionError events', () => {
        const router = createRouter();
        const observables = createObservables(router);
        const listener = { next: spy(), error() {}, complete: spy() };

        observables.transitionError$.addListener(listener);

        router.invokeEventListeners(constants.TRANSITION_START, state1, null);
        router.invokeEventListeners(
            constants.TRANSITION_ERROR,
            state1,
            null,
            error
        );

        expect(listener.next).to.have.been.calledTwice;
        expect(listener.next).to.have.been.calledWith(null);
        expect(listener.next).to.have.been.calledWith(error);

        router.invokeEventListeners(constants.ROUTER_STOP);

        expect(listener.complete).to.have.been.called;
    });

    it('should become null on a new transition start event', () => {
        const router = createRouter();
        const observables = createObservables(router);
        const listener = { next: spy(), error() {}, complete: spy() };

        observables.transitionError$.addListener(listener);

        router.invokeEventListeners(constants.TRANSITION_START, state1, null);
        router.invokeEventListeners(
            constants.TRANSITION_ERROR,
            state1,
            null,
            error
        );
        router.invokeEventListeners(constants.TRANSITION_START, state2, null);

        expect(listener.next).to.have.been.calledThrice;
        expect(listener.next).to.have.been.calledWith(null);
        expect(listener.next).to.have.been.calledWith(error);
        expect(listener.next).to.have.been.calledWith(null);

        router.invokeEventListeners(constants.ROUTER_STOP);

        expect(listener.complete).to.have.been.called;
    });
});
