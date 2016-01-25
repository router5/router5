/**
 * Event button.
 */
const which = (evt = window.event) => null === evt.which ? evt.button : evt.which;

/**
 * Check if `href` is the same origin.
 */
const sameOrigin = (href) => {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
};

const onClick = router => evt => {
    if (1 !== which(evt)) return;
    if (evt.metaKey || evt.ctrlKey || evt.shiftKey) return;
    if (evt.defaultPrevented) return;

    // ensure link
    let el = evt.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // check target
    if (el.target) return;

    if (!el.href) return;

    const routeMatch = router.matchUrl(el.href);

    if (routeMatch) {
        evt.preventDefault();
        var name = routeMatch.name;
        var params = routeMatch.params;

        router.navigate(name, params, {});
    }
};

export default onClick;
