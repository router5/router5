import { expect } from 'chai'
import createTestRouter from '../_create-router'
import sinon from 'sinon'
import { errorCodes } from '../../modules'

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
    let router, sandbox

    before(
        () =>
            (router = createTestRouter()
                .clone()
                .start())
    )
    after(() => router.stop())

    afterEach(() => sandbox.restore())
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    it('should support a transition middleware', function(done) {
        sandbox.spy(listeners, 'transition')
        router.stop()
        router.useMiddleware(() => listeners.transition)
        router.start('', () => {
            router.navigate('users', function(err, state) {
                expect(listeners.transition).to.have.been.called
                expect(state.hitMware).to.equal(true)
                expect(err).to.equal(null)
                done()
            })
        })
    })

    it('should log a warning if state is changed during transition', function(done) {
        sandbox.stub(console, 'error')
        router.stop()
        router.useMiddleware(() => listeners.transitionMutate)
        router.start('', () => {
            router.navigate('orders', function(err, state) {
                expect(console.error).to.have.been.called
                expect(err).to.equal(null)
                router.clearMiddleware()
                done()
            })
        })
    })

    it('should fail transition if middleware returns an error', function(done) {
        sandbox.spy(listeners, 'transitionErr')
        router.stop()
        router.useMiddleware(() => listeners.transitionErr)
        router.start('', err => {
            router.navigate('users', function(err, state) {
                expect(listeners.transitionErr).to.have.been.called
                expect(err.code).to.equal(errorCodes.TRANSITION_ERR)
                expect(err.reason).to.equal('because')
                done()
            })
        })
    })

    it('should be able to take more than one middleware', function(done) {
        sandbox.spy(listeners, 'transition')
        sandbox.spy(listeners, 'transitionErr')
        router.stop()
        router.clearMiddleware()
        router.useMiddleware(
            () => listeners.transition,
            () => listeners.transitionErr
        )
        router.start('', (err, state) => {
            router.navigate('users', function(err, state) {
                expect(listeners.transition).to.have.been.called
                expect(listeners.transitionErr).to.have.been.called
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
                expect(state.m1).to.equal(true)
                expect(state.m2).to.equal(true)
                expect(state.m3).to.equal(true)

                done()
            })
        })
    })
})
