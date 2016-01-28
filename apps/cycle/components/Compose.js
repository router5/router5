import { h, div, h4, input, textarea, p } from '@cycle/dom';
import Rx from 'rx';

function Compose(sources) {
    const initialState = { title: '', message: '' };

    const title$ = sources.DOM.select('.mail-title')
        .events('input')
        .map(evt => evt.target.value);

    const message$ = sources.DOM.select('.mail-message')
        .events('input')
        .map(evt => evt.target.value);


    const messageAndTitle$ = Rx.Observable.combineLatest(
            title$.startWith(''),
            message$.startWith(''),
            (title, message) => ({ title, message })
        ).map(_ => { console.log(_); return _; });

    const compose$ = Rx.Observable.combineLatest(
            messageAndTitle$,
            sources.router.error$.startWith(''),
            ({ title, message }, routerError) => div({ className: 'compose' }, [
                h4('Compose a new message'),
                input({ className: 'mail-title', name: 'title', value: title }),
                textarea({ className: 'mail-message', name: 'message', value: message }),
                routerError ? p('Clear inputs before continuing') : null
            ])
        );

    return {
        DOM: compose$,
        router: messageAndTitle$
            .map(({ message, title }) => [ 'canDeactivate', 'compose', !message && !title ])
            .distinctUntilChanged(_ => _[2])
    };
};

export default Compose;
