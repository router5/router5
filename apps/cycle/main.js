import Cycle from '@cycle/core';
import { div, label, input, h1, a, makeDOMDriver } from '@cycle/dom';
import routes from './routes';
import Router5, { loggerPlugin } from 'router5';
import historyPlugin from 'router5-history';
import makeRouter5Driver from './driver';
import Rx from 'rx';

const router = new Router5()
    .add(routes)
    .setOption('useHash', true)
    .setOption('defaultRoute', 'inbox')
    .usePlugin(loggerPlugin())
    .usePlugin(historyPlugin());

function main(sources) {
    const name$ = sources.DOM.select('.field').events('input')
            .map(evt => evt.target.value)
            .startWith('');

    const nameAndRoute$ = Rx.Observable.combineLatest(
        name$,
        sources.router.route$,
        (name, route) => ({ name, route })
    );

    const sinks = {
        DOM: nameAndRoute$
            .map(({ name, route }) =>
                div([
                    label('Name:'),
                    input('.field', {attributes: {type: 'text'}}),
                    h1('Hello ' + name + ', you are on route ' + route.name),
                    a({ href: sources.router.buildUrl('inbox') }, 'Inbox'),
                    a({ href: sources.router.buildUrl('compose') }, 'Compose')
                ])
            ),
        router: sources.DOM.select('a').events('click')
            .map(evt => {
                const route = sources.router.matchUrl(evt.target.href);
                if (route) {
                    evt.preventDefault();
                }
                return route || {};
            })
            .filter(({ name, params }) => name && !sources.router.isActive(name, params))
            .map(({ name, params }) => [ 'navigate', name, params ])
    };
    return sinks;
}

Cycle.run(main, {
    DOM: makeDOMDriver('#app'),
    router: makeRouter5Driver(router)
});
