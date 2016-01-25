import { h, div } from '@cycle/dom';

function Compose(sources) {
    const compose$ = Rx.Observable.of(
        div('Compose an email')
    );

    return {
        DOM: compose$
    };
};

export default Compose;
