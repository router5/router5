import createObservables from '..'
import createRouter, { constants } from 'router5'

const state1 = { name: 'route1', path: '/route1', meta: { params: {} } }
const state2 = { name: 'route2', path: '/route2', meta: { params: {} } }
const state3 = { name: 'route3', path: '/route3', meta: { params: {} } }

describe('route$', () => {
    it('should push new values to route$ on transitionSuccess events', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete: jest.fn() }

        observables.route$.subscribe(listener)

        expect(listener.next).toHaveBeenCalledWith(null)

        router.invokeEventListeners(constants.TRANSITION_START, state1, null)
        router.invokeEventListeners(constants.TRANSITION_SUCCESS, state1, null)

        expect(listener.next).toHaveBeenCalledWith(state1)

        router.invokeEventListeners(constants.TRANSITION_START, state2, state1)
        router.invokeEventListeners(
            constants.TRANSITION_SUCCESS,
            state2,
            state1
        )

        expect(listener.next).toHaveBeenCalledWith(state2)

        router.invokeEventListeners(constants.TRANSITION_START, state3, state2)
        router.invokeEventListeners(
            constants.TRANSITION_SUCCESS,
            state3,
            state2
        )
        expect(listener.next).toHaveBeenCalledWith(state3)

        router.invokeEventListeners(constants.ROUTER_STOP)

        expect(listener.complete).toHaveBeenCalled()
    })

    it('should not push new values to route$ on transitionError events', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete() {} }

        observables.route$.subscribe(listener)
        router.invokeEventListeners(constants.TRANSITION_START, state1, null)
        router.invokeEventListeners(
            constants.TRANSITION_ERROR,
            state1,
            null,
            'error'
        )

        expect(listener.next).toHaveBeenCalledTimes(1)
        expect(listener.next).toHaveBeenCalledWith(null)

        router.invokeEventListeners(constants.ROUTER_STOP)
    })
})
