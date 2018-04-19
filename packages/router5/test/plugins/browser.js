import createTestRouter from '../_create-router'
import { spy } from 'sinon'
import browserPlugin from '../../modules/plugins/browser'
import browser from '../../modules/plugins/browser/browser'
import constants from '../../modules/constants'
import { expect } from 'chai'

const base = window.location.pathname
let router
const hashPrefix = '!'

let currentHistoryState
const mockedBrowser = {
    ...browser,
    getBase: () => base,
    pushState: state => (currentHistoryState = state),
    replaceState: state => (currentHistoryState = state),
    addPopstateListener: spy(),
    removePopstateListener: spy(),
    getState: () => currentHistoryState
}
spy(mockedBrowser, 'pushState')
spy(mockedBrowser, 'replaceState')

function withoutMeta(state) {
    if (!state.meta.id) {
        throw new Error('No state id')
    }
    return {
        name: state.name,
        params: state.params,
        path: state.path
    }
}

describe('browserPlugin', function() {
    test(false)
    test(true)
})

function test(useHash) {
    function makeUrl(path) {
        return (
            'https://www.mysite.com:8080' +
            base +
            (useHash ? '#' + hashPrefix : '') +
            path
        )
    }

    describe(useHash ? 'With hash' : 'Without hash', function() {
        before(function() {
            router = createTestRouter()
            currentHistoryState = undefined
            router.usePlugin(
                browserPlugin({ base, useHash, hashPrefix }, mockedBrowser)
            )
        })

        after(function() {
            router.stop()
        })

        it('should be registered', function() {
            expect(router.hasPlugin('browserPlugin')).to.be.true
        })

        it('should update history on start', function(done) {
            router.start(function(err, state) {
                expect(mockedBrowser.replaceState).to.have.been.calledWith(
                    state
                )
                done()
            })
        })

        it('should update on route change', function(done) {
            router.navigate('users', function(err, state) {
                expect(mockedBrowser.pushState).to.have.been.calledWith(state)
                done()
            })
        })

        it('should handle popstate events', function(done) {
            const homeState = { name: 'home', params: {}, path: '/home' }
            const popStateListener =
                mockedBrowser.addPopstateListener.args[0][0]
            const popState = state => {
                mockedBrowser.getState = () => state
                popStateListener({ state })
            }

            router.navigate('home', function(err, state1) {
                expect(withoutMeta(state1)).to.eql(homeState)

                router.navigate('users', function(err, state2) {
                    expect(withoutMeta(state2)).to.eql({
                        name: 'users',
                        params: {},
                        path: '/users'
                    })
                    // router.registerComponent('users', {canDeactivate: function () { return false; }});
                    popState(state1)
                    setTimeout(function() {
                        expect(
                            mockedBrowser.replaceState
                        ).to.have.been.calledWith({
                            ...state1,
                            meta: {
                                ...state1.meta,
                                id: state1.meta.id,
                                source: 'popstate'
                            }
                        })
                        // expect(withoutMeta(router.getState())).to.eql(homeState);
                        popState(state2)
                        // Push to queue
                        setTimeout(function() {
                            expect(withoutMeta(router.getState())).to.eql({
                                name: 'users',
                                params: {},
                                path: '/users'
                            })
                            // router.canDeactivate('users');
                            done()
                        })
                    })
                })
            })
        })

        it('should be able to extract the path of an URL', function() {
            expect(router.urlToPath(makeUrl('/home'))).to.equal('/home')
            expect(() => router.urlToPath('')).to.throw()
        })

        it('should match an URL', function() {
            expect(withoutMeta(router.matchUrl(makeUrl('/home')))).to.eql({
                name: 'home',
                params: {},
                path: '/home'
            })
            expect(
                withoutMeta(router.matchUrl(makeUrl('/users/view/1')))
            ).to.eql({
                name: 'users.view',
                params: { id: '1' },
                path: '/users/view/1'
            })
        })

        it('should build URLs', () => {
            const prefix = base + (useHash ? '#!' : '')

            expect(router.buildUrl('home', {})).to.equal(prefix + '/home')
            expect(
                router.buildUrl(constants.UNKNOWN_ROUTE, {
                    path: '/route-not-found'
                })
            ).to.equal(prefix + '/route-not-found')
            expect(router.buildUrl('undefined', {})).to.equal(null)
        })
    })
}
