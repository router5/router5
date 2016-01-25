import { h, div, h4, input, textarea, p } from '@cycle/dom';
import Rx from 'rx';

function Compose(sources) {
    const title$ = sources.DOM.select('input')
        .events('input')
        .map(evt => evt.target.value)
        .startWith('');

    const message$ = sources.DOM.select('textarea')
        .events('input')
        .map(evt => evt.target.value)
        .startWith('');

    const messageAndTitle$ = Rx.Observable.combineLatest(
            title$,
            message$,
            sources.router.error$,
            (title, message, routerError) => ({ title, message, routerError })
        );

    return {
        DOM: messageAndTitle$
            .map(({ message, title, routerError }) => div({ className: 'compose' }, [
                h4('Compose a new message'),
                input({ name: 'title', value: title }),
                textarea({ name: 'message', value: message }),
                routerError ? p('Clear inputs before continuing') : null
            ])),
        router: messageAndTitle$
            .map(({ message, title }) => [ 'canDeactivate', 'compose', !message && !title ])
            .distinctUntilChanged(_ => _[2])
    };
};

export default Compose;
