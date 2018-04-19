/// <reference path="../../index.d.ts" />

import createRouter, { Dependencies, Route, Router, State } from 'router5'
import { Options } from 'router5/create-router'

const routes: Route[] = [
    { name: 'home', path: '/' },
    { name: 'users', path: '/users/:id' }
]

const options: Partial<Options> = {
    defaultRoute: 'home',
    defaultParams: { lang: 'en' },
    strictTrailingSlash: false,
    trailingSlashMode: 'never',
    autoCleanUp: true,
    queryParamsMode: 'default',
    allowNotFound: false,
    strongMatching: true,
    caseSensitive: false
}

const deps: Dependencies = { store: {} }

const router = createRouter([])

let r: Router
r = createRouter(routes)
r = createRouter(routes, options)
r = createRouter(routes, {
    strictTrailingSlash: true,
    queryParamsMode: 'strict'
})
r = createRouter(routes, options, deps)

let s: State
s = router.makeState('home', {}, '/')
s = router.makeState('home', {}, '/', {})
s = router.makeState('home', {}, '/', {}, '')
s = router.makeState('home', {}, '/', {}, '', 0)

s = router.makeNotFoundState('/')

s = router.getState()

router.setState(s)

const _o: Options = router.getOptions()

r = router.setOption('defaultRoute', 'home')
r = router.setOption('defaultParams', { lang: 'en' })
r = router.setOption('queryParamsMode', 'strict')

r = router.setDependency('store', {})
r = router.setDependency('counter', 0)
r = router.setDependency('foo', 'bar')

r = router.setDependencies(deps)

const _d: Dependencies = router.getDependencies()

r = router.add(routes)
r = router.add({ name: 'home', path: '/' })

r = router.addNode('home', '/')
r = router.addNode('home', '/', () => () => true)
