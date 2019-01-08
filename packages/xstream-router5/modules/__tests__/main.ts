import { Stream } from 'xstream'
import createRouter from 'router5'
import createObservables from '../'

describe('xsPlugin', () => {
    let observables

    beforeAll(() => {
        observables = createObservables(createRouter())
    })

    it('should initialise observables', () => {
        expect(observables).toBeDefined()
    })

    it('should expose a route$ observable', () => {
        expect(observables.route$).toBeInstanceOf(Stream)
    })

    it('should expose a routeNode observable factory', () => {
        expect(observables.routeNode('')).toBeInstanceOf(Stream)
    })

    it('should expose a transitionError$ observable', () => {
        expect(observables.transitionError$).toBeInstanceOf(Stream)
    })

    it('should expose a transitionRoute$ observable', () => {
        expect(observables.transitionRoute$).toBeInstanceOf(Stream)
    })
})
