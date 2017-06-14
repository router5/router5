import Rx from 'rx';
import { h, div, a, makeDOMDriver } from '@cycle/dom';
import { startsWithSegment } from 'router5-helpers';
import Inbox from './Inbox';
import Compose from './Compose';

function Main(sources) {
    const routerSource = sources.router;

    const routeComponent$ = routerSource.routeNode$('').map(route => {
        const startsWith = startsWithSegment(route);

        if (startsWith('inbox')) {
            return Inbox(sources);
        }

        if (startsWith('compose')) {
            return Compose(sources);
        }

        return {
            DOM: Rx.Observable.of(div('Route component not implemented'))
        };
    });

    return {
        DOM: routeComponent$.flatMapLatest(component => component.DOM),
        router: routeComponent$.flatMapLatest(
            component => component.router || Rx.Observable.empty()
        )
    };
}

export default Main;
