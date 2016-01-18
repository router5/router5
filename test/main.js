import { expect } from 'chai';
import { routeNodeSelector, router5Reducer, actions, actionTypes } from '../modules';

const route1 = { name: 'a.1' };
const route2 = { name: 'a.2' };
const route3 = { name: 'b' };

describe('redux-router5', () => {
    describe('actions', () => {
        it('transitionStart', () => {
            expect(actions.transitionStart(route1, route2)).to.eql({
                type: actionTypes.TRANSITION_START,
                payload: {
                    route: route1,
                    previousRoute: route2
                }
            });
        });

        it('transitionSuccess', () => {
            expect(actions.transitionSuccess(route1, route2)).to.eql({
                type: actionTypes.TRANSITION_SUCCESS,
                payload: {
                    route: route1,
                    previousRoute: route2
                }
            });
        });

        it('transitionError', () => {
            expect(actions.transitionError(route1, route2, 'ERR')).to.eql({
                type: actionTypes.TRANSITION_ERROR,
                payload: {
                    route: route1,
                    previousRoute: route2,
                    transitionError: 'ERR'
                }
            });
        });
    });

    describe('router5Reducer', () => {
        let state;

        before(() => state = {
            route: null,
            previousRoute: null,
            transitionRoute: null,
            transitionError: null
        });

        it('should handle transitionStart actions', () => {
            state = router5Reducer(state, actions.transitionStart(route2, route1));
            expect(state.transitionRoute).to.equal(route2);
            expect(state.transitionError).to.equal(null);
        });

        it('should handle transitionSuccess actions', () => {
            state = router5Reducer(state, actions.transitionSuccess(route2, route1));
            expect(state.transitionRoute).to.equal(null);
            expect(state.transitionError).to.equal(null);
            expect(state.route).to.equal(route2);
        });

        it('should handle transitionError actions', () => {
            state = router5Reducer(state, actions.transitionError(route2, route1, 'ERR'));
            expect(state.transitionRoute).to.equal(route2);
            expect(state.transitionError).to.equal('ERR');
        });

        it('should handle clearErrors actions', () => {
            state = router5Reducer(state, actions.clearErrors());
            expect(state.transitionRoute).to.equal(null);
            expect(state.transitionError).to.equal(null);
        });
    });

    describe('routeNodeSelector', () => {
        it('should memoize routes', () => {
            const rootSelector = routeNodeSelector('');
            const aSelector = routeNodeSelector('a');

            let router = {
                route: route1,
                previousRoute: null
            };
            expect(rootSelector({ router }).route).to.equal(route1);
            expect(aSelector({ router }).route).to.equal(route1);

            router = {
                route: route2,
                previousRoute: route1
            };
            expect(rootSelector({ router }).route).to.equal(route1);
            expect(aSelector({ router }).route).to.equal(route2);

            router = {
                route: route3,
                previousRoute: route2
            };
            expect(rootSelector({ router }).route).to.equal(route3);
            expect(aSelector({ router }).route).to.equal(route2);
        });
    });
});
