import { Observable } from 'rxjs'
import createObservables from '..'
import { createRouter, Router } from 'router5'

describe('rxPlugin', () => {
    let observables

    beforeAll(() => {
        const router: Router = createRouter()
        observables = createObservables(router)
    })

    it('should initialise observables', () => {
        expect(observables).toBeDefined()
    })

    it('should expose a route$ observable', () => {
        expect(observables.route$).toBeInstanceOf(Observable)
    })

    it('should expose a routeNode observable factory', () => {
        expect(observables.routeNode('')).toBeInstanceOf(Observable)
    })

    it('should expose a transitionError$ observable', () => {
        expect(observables.transitionError$).toBeInstanceOf(Observable)
    })

    it('should expose a transitionRoute$ observable', () => {
        expect(observables.transitionRoute$).toBeInstanceOf(Observable)
    })
})
