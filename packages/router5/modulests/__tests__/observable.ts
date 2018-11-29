import { from } from 'rxjs'
import { from as mostFrom } from 'most'
import xs from 'xstream'
import { createTestRouter } from './helpers'

describe('core/observable', function() {
    let router

    beforeAll(() => (router = createTestRouter().start()))
    afterAll(() => router.stop())

    it('should accept a listener function', () => {
        const unsubscribe = router.subscribe(() => {})

        expect(typeof unsubscribe).toBe('function')
    })

    it('should accept a listener object', () => {
        const subscription = router.subscribe({
            next: () => {}
        })

        expect(typeof subscription.unsubscribe).toBe('function')
    })

    it('should be compatible with rxjs', function() {
        const observable = from(router)

        expect(observable.subscribe).toBeDefined()
    })

    it('should be compatible with xstream', function() {
        const observable = xs.from(router)

        expect(observable.subscribe).toBeDefined()
    })

    it('should be compatible with most', function() {
        const observable = mostFrom(router)

        expect(observable.subscribe).toBeDefined()
    })
})
