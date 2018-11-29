import createTestRouter from './helpers/testRouters'
import { errorCodes } from '../'

const listeners = {
    transition: (toState, fromState, done) => {
        const newState = {
            name: toState.name,
            params: toState.params,
            path: toState.path,
            hitMware: true
        }
        done(null, newState)
    },
    transitionMutate: (toState, fromState, done) => {
        const newState = {
            name: toState.name + 'modified',
            params: toState.params,
            path: toState.path,
            hitMware: true
        }
        done(null, newState)
    },
    transitionErr: (toState, fromState, done) => {
        done({ reason: 'because' })
    },
    noop() {}
}

describe('core/middleware', () => {
    let router

    beforeEach(() => (router = createTestRouter().start()))
    afterEach(() => {
        jest.restoreAllMocks()
        router.stop()
    })

    it('should support a transition middleware', done => {
        jest.spyOn(listeners, 'transition')
        router.stop()
        router.useMiddleware(() => listeners.transition)
        router.start('', () => {
            router.navigate('users', function(err, state) {
                expect(listeners.transition).toHaveBeenCalled()
                expect(state.hitMware).toEqual(true)
                expect(err).toEqual(null)
                done()
            })
        })
    })

    it('should log a warning if state is changed during transition', done => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        router.stop()
        router.useMiddleware(() => listeners.transitionMutate)
        router.start('', () => {
            router.navigate('orders', function(err, state) {
                expect(console.error).toHaveBeenCalled()
                expect(err).toEqual(null)
                router.clearMiddleware()
                done()
            })
        })
    })

    it('should fail transition if middleware returns an error', done => {
        jest.spyOn(listeners, 'transitionErr')
        router.stop()
        router.useMiddleware(() => listeners.transitionErr)
        router.start('', err => {
            router.navigate('users', function(err, state) {
                expect(listeners.transitionErr).toHaveBeenCalled()
                expect(err.code).toEqual(errorCodes.TRANSITION_ERR)
                expect(err.reason).toEqual('because')
                done()
            })
        })
    })

    it('should be able to take more than one middleware', done => {
        jest.spyOn(listeners, 'transition')
        jest.spyOn(listeners, 'transitionErr')
        router.stop()
        router.clearMiddleware()
        router.useMiddleware(
            () => listeners.transition,
            () => listeners.transitionErr
        )
        router.start('', (err, state) => {
            router.navigate('users', function(err, state) {
                expect(listeners.transition).toHaveBeenCalled()
                expect(listeners.transitionErr).toHaveBeenCalled()
                done()
            })
        })
    })

    it('should pass state from middleware to middleware', done => {
        const m1 = () => (toState, fromState, done) => {
            done(null, { ...toState, m1: true })
        }
        const m2 = () => toState =>
            Promise.resolve({ ...toState, m2: toState.m1 })

        const m3 = () => (toState, fromState, done) => {
            done(null, { ...toState, m3: toState.m2 })
        }
        router.clearMiddleware()
        router.useMiddleware(m1, m2, m3)

        router.start('', () => {
            router.navigate('users', function(err, state) {
                expect(state.m1).toEqual(true)
                expect(state.m2).toEqual(true)
                expect(state.m3).toEqual(true)

                done()
            })
        })
    })
})
