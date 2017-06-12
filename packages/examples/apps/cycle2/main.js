import Cycle from '@cycle/core';
import Rx from 'rx';
import { h, div, a, makeDOMDriver } from '@cycle/dom';
import makeRouter5Driver from '../cycle/router5/driver';
import createRouter from './create-router';
import routes from './routes';
import Nav from './components/Nav';
import randomColor from 'randomcolor';

const randomBgColor = () => ({ backgroundColor: randomColor() });

function main(sources) {
    const navSinks = Nav(sources);
    const nav$ = navSinks.DOM.startWith();

    const main$ = sources.router
        .routeNode$('')
        .flatMapLatest(route => {
            const childNode = route.name.split('.')[0];

            const routeElm = div(
                { className: 'item', style: randomBgColor() },
                childNode
            );

            const Route = segment => div({ className: 'column' }, [
                routeElm,
                segment
                    ? div({ className: 'item', style: randomBgColor() }, segment)
                    : div({ className: 'item' }, '_')
            ]);

            return sources.router
                .routeNode$(childNode)
                .map(route => Route(route.name.split('.')[1]));
        });

    const vtree$ = Rx.Observable.combineLatest(
        nav$,
        main$,
        (nav, main) => div('.box', [
            h('aside', nav),
            h('main', main)
        ])
    );

    return {
        DOM: vtree$
    };
}

Cycle.run(main, {
    DOM: makeDOMDriver('#app'),
    router: makeRouter5Driver(createRouter(routes))
});
