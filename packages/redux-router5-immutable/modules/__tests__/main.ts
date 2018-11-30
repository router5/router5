import { State } from 'router5'
import { Record, Map } from 'immutable'
import {
    createRouteNodeSelector,
    router5Reducer,
    actions,
    actionTypes
} from '..'

const route1 = { name: 'a.1', meta: { params: {} } } as State
const route2 = { name: 'a.2', meta: { params: {} } } as State
const route3 = { name: 'b', meta: { params: {} } } as State
const State = Record({
    route: null,
    previousRoute: null,
    transitionRoute: null,
    transitionError: null
})

describe('redux-router5-immutable', () => {
    describe('actions', () => {
        it('transitionStart', () => {
            expect(actions.transitionStart(route1, route2)).toEqual({
                type: actionTypes.TRANSITION_START,
                payload: {
                    route: route1,
                    previousRoute: route2
                }
            })
        })

        it('transitionSuccess', () => {
            expect(actions.transitionSuccess(route1, route2)).toEqual({
                type: actionTypes.TRANSITION_SUCCESS,
                payload: {
                    route: route1,
                    previousRoute: route2
                }
            })
        })

        it('transitionError', () => {
            expect(actions.transitionError(route1, route2, 'ERR')).toEqual({
                type: actionTypes.TRANSITION_ERROR,
                payload: {
                    route: route1,
                    previousRoute: route2,
                    transitionError: 'ERR'
                }
            })
        })
    })

    describe('router5Reducer', () => {
        let state

        beforeAll(() => (state = new State()))

        it(`should handle transitionStart actions`, () => {
            state = router5Reducer(
                state,
                actions.transitionStart(route2, route1)
            )
            expect(state.transitionRoute).toBe(route2)
            expect(state.transitionError).toBe(null)
        })

        it(`should handle transitionSuccess actions`, () => {
            state = router5Reducer(
                state,
                actions.transitionSuccess(route2, route1)
            )
            expect(state.transitionRoute).toBe(null)
            expect(state.transitionError).toBe(null)
            expect(state.route).toBe(route2)
        })

        it(`should handle transitionError actions`, () => {
            state = router5Reducer(
                state,
                actions.transitionError(route2, route1, 'ERR')
            )
            expect(state.transitionRoute).toBe(route2)
            expect(state.transitionError).toBe('ERR')
        })

        it(`should handle clearErrors actions`, () => {
            state = router5Reducer(state, actions.clearErrors())
            expect(state.transitionRoute).toBe(null)
            expect(state.transitionError).toBe(null)
        })
    })

    describe('createRouteNodeSelector using immutable state', () => {
        it('should memoize routes', () => {
            const rootSelector = createRouteNodeSelector('')
            const aSelector = createRouteNodeSelector('a')

            let router = new State({
                route: route1,
                previousRoute: null
            })
            expect(rootSelector(Map({ router })).route).toBe(route1)
            expect(aSelector({ router }).route).toBe(route1)

            router = new State({
                route: route2,
                previousRoute: route1
            })
            expect(rootSelector(Map({ router })).route).toBe(route1)
            expect(aSelector({ router }).route).toBe(route2)

            router = new State({
                route: route3,
                previousRoute: route2
            })
            expect(rootSelector(Map({ router })).route).toBe(route3)
            expect(aSelector({ router }).route).toBe(route2)
        })
    })
})
