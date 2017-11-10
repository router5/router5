import Cycle from '@cycle/core'
import Rx from 'rx'
import { h, div, a, makeDOMDriver } from '@cycle/dom'
import makeRouter5Driver from './router5/driver'
import createRouter from './create-router'
import routes from './routes'
import emails from './data/emails'
import Nav from './components/Nav'
import Main from './components/Main'
import { shouldInterceptEvent, onClick } from './router5/link-on-click'

function main(sources) {
    const navigationInstruction$ = Rx.Observable.fromEvent(
        document,
        'click',
        'a'
    )
        .filter(shouldInterceptEvent(sources.router))
        // .map(_ => console.log(_) && _)
        .map(onClick(sources.router))

    const navSinks = Nav(sources)
    const nav$ = navSinks.DOM.startWith()
    // const nav$ = Rx.Observable.of('Nav');

    const mainSinks = Main(sources)
    const main$ = mainSinks.DOM
    const routerInstructions$ = mainSinks.router

    const vtree$ = Rx.Observable.combineLatest(nav$, main$, (nav, main) =>
        div('.mail-client', [h('aside', nav), h('main', main)])
    )

    return {
        DOM: vtree$,
        router: Rx.Observable.merge(navigationInstruction$, routerInstructions$)
    }
}

function makeDataDriver() {
    return () => ({
        emails$: Rx.Observable.of(emails)
    })
}

Cycle.run(main, {
    DOM: makeDOMDriver('#app'),
    router: makeRouter5Driver(createRouter(routes)),
    data: makeDataDriver()
})
