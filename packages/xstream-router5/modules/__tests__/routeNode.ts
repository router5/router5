import createObservables from '..'
import createRouter, { constants } from 'router5'

const state1 = { name: 'route1', path: '/route1', meta: { params: {} } }
const state2 = { name: 'route2', path: '/route2', meta: { params: {} } }
const state3 = { name: 'route3', path: '/route3', meta: { params: {} } }

const nestedA = { name: 'a', path: '/a', meta: { params: {} } }
const nestedAB = { name: 'a.b', path: '/a/b', meta: { params: {} } }
const nestedAC = { name: 'a.c', path: '/a/c', meta: { params: {} } }

describe('routeNode', () => {
    it('should see route updates for the root node', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete: jest.fn() }

        observables.routeNode('').addListener(listener)

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

    it('should work with nested routes', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: jest.fn(), error() {}, complete() {} }

        observables.routeNode('a').addListener(listener)

        router.invokeEventListeners(constants.TRANSITION_START, nestedA, null)
        router.invokeEventListeners(constants.TRANSITION_SUCCESS, nestedA, null)

        router.invokeEventListeners(
            constants.TRANSITION_START,
            nestedAB,
            nestedA
        )
        router.invokeEventListeners(
            constants.TRANSITION_SUCCESS,
            nestedAB,
            nestedA
        )

        expect(listener.next).toHaveBeenCalledWith(nestedAB)

        router.invokeEventListeners(
            constants.TRANSITION_START,
            nestedAC,
            nestedAB
        )
        router.invokeEventListeners(
            constants.TRANSITION_SUCCESS,
            nestedAC,
            nestedAB
        )

        expect(listener.next).toHaveBeenCalledWith(nestedAC)

        router.invokeEventListeners(constants.ROUTER_STOP)
    })
})
