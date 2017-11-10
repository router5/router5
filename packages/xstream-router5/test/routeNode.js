import { expect } from 'chai'
import { spy } from 'sinon'
import { state1, state2, state3 } from './_helpers'
import createObservables from '../modules'
import createRouter, { constants } from '../../router5'

const nestedA = { name: 'a', path: '/a', meta: { params: {} } }
const nestedAB = { name: 'a.b', path: '/a/b', meta: { params: {} } }
const nestedAC = { name: 'a.c', path: '/a/c', meta: { params: {} } }

describe('routeNode', () => {
    it('should see route updates for the root node', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: spy(), error() {}, complete: spy() }

        observables.routeNode('').addListener(listener)

        router.invokeEventListeners(constants.TRANSITION_START, state1, null)
        router.invokeEventListeners(constants.TRANSITION_SUCCESS, state1, null)

        expect(listener.next).to.have.been.calledWith(state1)

        router.invokeEventListeners(constants.TRANSITION_START, state2, state1)
        router.invokeEventListeners(
            constants.TRANSITION_SUCCESS,
            state2,
            state1
        )

        expect(listener.next).to.have.been.calledWith(state2)

        router.invokeEventListeners(constants.TRANSITION_START, state3, state2)
        router.invokeEventListeners(
            constants.TRANSITION_SUCCESS,
            state3,
            state2
        )

        expect(listener.next).to.have.been.calledWith(state3)

        router.invokeEventListeners(constants.ROUTER_STOP)

        expect(listener.complete).to.have.been.called
    })

    it('should work with nested routes', () => {
        const router = createRouter()
        const observables = createObservables(router)
        const listener = { next: spy(), error() {}, complete() {} }

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

        expect(listener.next).to.have.been.calledWith(nestedAB)

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

        expect(listener.next).to.have.been.calledWith(nestedAC)

        router.invokeEventListeners(constants.ROUTER_STOP)
    })
})
