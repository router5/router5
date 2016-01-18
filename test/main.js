import { expect } from 'chai';
import { routeNodeSelector } from '../modules';

describe('redux-router5', () => {
    describe('routeNodeSelector', () => {
        it('should memoize routes', () => {
            const route1 = { name: 'a.1' };
            const route2 = { name: 'a.2' };
            const route3 = { name: 'b' };

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
