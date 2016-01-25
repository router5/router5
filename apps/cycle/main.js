import Cycle from '@cycle/core';
import Rx from 'rx';
import { h, div, a, makeDOMDriver } from '@cycle/dom';
import makeRouter5Driver from './router5/driver';
import createRouter from './create-router';
import routes from './routes';
import emails from './data/emails';
import Nav from './components/Nav';
import Main from './components/Main';

function main(sources) {
    const navSinks = Nav(sources);
    const nav$ = navSinks.DOM.startWith();
    // const nav$ = Rx.Observable.of('Nav');

    const mainSinks = Main(sources);
    const main$ = mainSinks.DOM;

    const vtree$ = Rx.Observable.combineLatest(
        nav$,
        main$,
        (nav, main) => div('.mail-client', [
            h('aside', nav),
            h('main', main)
        ])
    );

    return {
        DOM: vtree$,
        router: mainSinks.router
    };
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
});
