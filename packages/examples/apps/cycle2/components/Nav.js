import { h, a } from '@cycle/dom';

const LinkFactory = router => route => a({
        href: router.buildUrl(route),
        className: router.isActive(route, {}, true) ? 'active' : ''
    }, route);

function Nav(sources) {
    const routerSource = sources.router;
    const Link = LinkFactory(routerSource);

    const nav$ = routerSource
        .route$
        .map(route =>
            h('nav', [
                Link('a'),
                Link('a.a'),
                Link('a.b'),
                Link('a.c'),
                Link('b'),
                Link('b.a'),
                Link('b.b'),
                Link('b.c')
            ])
        );

    return {
        DOM: nav$
    };
};

export default Nav;
