import { h, a } from '@cycle/dom';

function Nav(sources) {
    const routerSource = sources.router;

    const nav$ = routerSource
        .route$
        .map(route =>
            h('nav', [
                a({ href: sources.router.buildUrl('inbox'), className: routerSource.isActive('inbox') ? 'active' : '' }, 'Inbox'),
                a({ href: sources.router.buildUrl('compose'), className: routerSource.isActive('compose') ? 'active' : '' }, 'Compose')
            ])
        );

    return {
        DOM: nav$
    };
};

export default Nav;
