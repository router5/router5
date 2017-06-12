import { expect } from 'chai';
import { Stream } from 'xstream';
import createRouter from 'router5';
import createObservables from '../modules';

describe('xsPlugin', () => {
    let observables;

    before(() => {
        observables = createObservables(createRouter());
    });

    it('should initialise observables', () => {
        expect(observables).to.exist;
    });

    it('should expose a route$ observable', () => {
        expect(observables.route$).to.be.instanceof(Stream);
    });

    it('should expose a routeNode observable factory', () => {
        expect(observables.routeNode('')).to.be.instanceof(Stream);
    });

    it('should expose a transitionError$ observable', () => {
        expect(observables.transitionError$).to.be.instanceof(Stream);
    });

    it('should expose a transitionRoute$ observable', () => {
        expect(observables.transitionRoute$).to.be.instanceof(Stream);
    });
});
