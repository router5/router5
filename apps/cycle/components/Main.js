import Rx from 'rx';
import { h, div, a, makeDOMDriver } from '@cycle/dom';
import { startsWithSegment } from 'router5.helpers';
import Inbox from './Inbox';
import Compose from './Compose';

function Main(sources) {
    const routerSource = sources.router;

    const main$ = routerSource
        .routeNode$('')
        .flatMapLatest(route => {
            // Temp fix
            if (!route) {
                return Rx.Observable.of(div('Missing route'));
            }
            // End temp fix

            const startsWith = startsWithSegment(route);

            if (startsWith('inbox')) {
                const inboxSinks = Inbox(sources);
                const inbox$ = inboxSinks.DOM;
                return inbox$;
            }

            if (startsWith('compose')) {
                const composeSinks = Compose(sources);
                const compose$ = composeSinks.DOM;
                return compose$;
            }

            return Rx.Observable.of(div('Route component not implemented'));
        });

    return {
        DOM: main$
    };
};

export default Main;
