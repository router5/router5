import { expect } from 'chai';
import { Observable } from 'rxjs';
import createObservables from '../modules';
import createRouter from 'router5';

describe('rxPlugin', () => {
    let observables;

    before(() => {
        observables = createObservables(createRouter());
    });

    it('should initialise observables', () => {
        expect(observables).to.exist;
    });

    it('should expose a route$ observable', () => {
        expect(observables.route$).to.be.instanceof(Observable);
    });

    it('should expose a routeNode observable factory', () => {
        expect(observables.routeNode('')).to.be.instanceof(Observable);
    });

    it('should expose a transitionError$ observable', () => {
        expect(observables.transitionError$).to.be.instanceof(Observable);
    });

    it('should expose a transitionRoute$ observable', () => {
        expect(observables.transitionRoute$).to.be.instanceof(Observable);
    });
});
