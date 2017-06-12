import { div } from '@cycle/dom';
import randomColor from 'randomcolor';

const randomBgColor = () => ({ backgroundColor: randomColor() });

const Route = node => sources => {
    console.log(node);
    const route$ = sources.router.routeNode$(node);

    const vDom$ = route$
        .map(route => div(
            { className: 'item row', style: randomBgColor() },
            route ? route.name : '')
        );

    return {
        DOM: vDom$
    };
}

export default Route;
