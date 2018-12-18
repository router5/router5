import { createRouter, constants } from 'router5'
import browserPlugin from '../'
import browser from '../browser'
import { Browser } from '../types'

const base = window.location.pathname
let router
const hashPrefix = '!'
let currentHistoryState
const mockedBrowser: Browser = {
    ...browser,
    getBase: () => base,
    pushState: state => (currentHistoryState = state),
    replaceState: state => (currentHistoryState = state),
    addPopstateListener: jest.fn(),
    getState: () => currentHistoryState
}

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
    const prefix = useHash ? '/#!' : ''

    function makeUrl(path) {
        return (
            'https://www.mysite.com:8080' +
            (useHash ? '#' + hashPrefix : '') +
            path
        )
    }

    describe(useHash ? 'With hash' : 'Without hash', function() {
        beforeAll(function() {
            router = createRouter(
                [
                    {
                        name: 'users',
                        path: '/users',
                        children: [
                            {
                                name: 'view',
                                path: '/view/:id'
                            },
                            {
                                name: 'list',
                                path: '/list'
                            }
                        ]
                    },
                    {
                        name: 'home',
                        path: '/home'
                    }
                ],
                {
                    defaultRoute: 'home'
                }
            )
            currentHistoryState = undefined
            router.usePlugin(
                browserPlugin({ useHash, hashPrefix }, mockedBrowser)
            )
        })

        afterAll(function() {
            router.stop()
        })

        beforeEach(() => {
            jest.spyOn(mockedBrowser, 'pushState')
            jest.spyOn(mockedBrowser, 'replaceState')
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        it('should update history on start', function(done) {
            router.start(function(err, state) {
                //@ts-ignore
                expect(mockedBrowser.replaceState).toHaveBeenCalledWith(
                    state,
                    '',
                    prefix + '/home'
                )
                done()
            })
        })

        it('should update on route change', function(done) {
            router.navigate('users', function(err, state) {
                expect(mockedBrowser.pushState).toHaveBeenCalledWith(
                    state,
                    '',
                    prefix + '/users'
                )
                done()
            })
        })

        it('should match an URL', function() {
            expect(withoutMeta(router.matchUrl(makeUrl('/home')))).toEqual({
                name: 'home',
                params: {},
                path: '/home'
            })
            expect(
                withoutMeta(router.matchUrl(makeUrl('/users/view/1')))
            ).toEqual({
                name: 'users.view',
                params: { id: '1' },
                path: '/users/view/1'
            })
        })

        it('should build URLs', () => {
            expect(router.buildUrl('home', {})).toBe(prefix + '/home')
            expect(
                router.buildUrl(constants.UNKNOWN_ROUTE, {
                    path: '/route-not-found'
                })
            ).toBe(prefix + '/route-not-found')
            expect(router.buildUrl('undefined', {})).toBe(null)
        })
    })
}
