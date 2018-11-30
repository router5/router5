import createObservables from '..'
import createRouter, { constants } from 'router5'

const state1 = { name: 'route1', path: '/route1', meta: { params: {} } }
const state2 = { name: 'route2', path: '/route2', meta: { params: {} } }
const error = 'error'

describe('transitionError$', () => {
    it('should push new values to transitionError$ on transitionError events', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete: jest.fn() }

        observables.transitionError$.addListener(listener)

        router.invokeEventListeners(constants.TRANSITION_START, state1, null)
        router.invokeEventListeners(
            constants.TRANSITION_ERROR,
            state1,
            null,
            error
        )

        expect(listener.next).toHaveBeenCalledTimes(2)
        expect(listener.next).toHaveBeenCalledWith(null)
        expect(listener.next).toHaveBeenCalledWith(error)

        router.invokeEventListeners(constants.ROUTER_STOP)

        expect(listener.complete).toHaveBeenCalled()
    })

    it('should become null on a new transition start event', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete: jest.fn() }

        observables.transitionError$.addListener(listener)

        router.invokeEventListeners(constants.TRANSITION_START, state1, null)
        router.invokeEventListeners(
            constants.TRANSITION_ERROR,
            state1,
            null,
            error
        )
        router.invokeEventListeners(constants.TRANSITION_START, state2, null)

        expect(listener.next).toHaveBeenCalledTimes(3)
        expect(listener.next).toHaveBeenCalledWith(null)
        expect(listener.next).toHaveBeenCalledWith(error)
        expect(listener.next).toHaveBeenCalledWith(null)

        router.invokeEventListeners(constants.ROUTER_STOP)

        expect(listener.complete).toHaveBeenCalled()
    })
})
