import createObservables from '..'
import createRouter, { constants } from 'router5'

const state1 = { name: 'route1', path: '/route1', meta: { params: {} } }

describe('transitionRoute$', () => {
    it('should push new values to transitionRoute$ on transitionStart events', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete: jest.fn() }

        observables.transitionRoute$.subscribe(listener)
        router.invokeEventListeners(constants.TRANSITION_START, state1, null)

        expect(listener.next).toHaveBeenCalledTimes(2)
        expect(listener.next).toHaveBeenCalledWith(null)
        expect(listener.next).toHaveBeenCalledWith(state1)

        router.invokeEventListeners(constants.ROUTER_STOP)

        expect(listener.complete).toHaveBeenCalled()
    })

    it('should become null on a transition success', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete: jest.fn() }

        observables.transitionRoute$.subscribe(listener)
        router.invokeEventListeners(constants.TRANSITION_START, state1, null)
        router.invokeEventListeners(constants.TRANSITION_SUCCESS, state1, null)

        expect(listener.next).toHaveBeenCalledTimes(3)
        expect(listener.next).toHaveBeenCalledWith(null)
        expect(listener.next).toHaveBeenCalledWith(state1)
        expect(listener.next).toHaveBeenCalledWith(null)

        router.invokeEventListeners(constants.ROUTER_STOP)
    })

    it('should become null on a transition error', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete() {} }

        observables.transitionRoute$.subscribe(listener)
        router.invokeEventListeners(constants.TRANSITION_START, state1, null)
        router.invokeEventListeners(constants.TRANSITION_ERROR, state1, null)

        expect(listener.next).toHaveBeenCalledTimes(3)
        expect(listener.next).toHaveBeenCalledWith(null)
        expect(listener.next).toHaveBeenCalledWith(state1)
        expect(listener.next).toHaveBeenCalledWith(null)

        router.invokeEventListeners(constants.ROUTER_STOP)
    })
})
