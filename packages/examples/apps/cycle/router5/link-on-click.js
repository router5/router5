/**
 * Event button.
 */
const which = (evt = window.event) =>
    null === evt.which ? evt.button : evt.which

/**
 * Check if `href` is the same origin.
 */
const sameOrigin = href => {
    var origin = location.protocol + '//' + location.hostname
    if (location.port) origin += ':' + location.port
    return href && 0 === href.indexOf(origin)
}

export const shouldInterceptEvent = router => evt => {
    if (1 !== which(evt)) return false
    if (evt.metaKey || evt.ctrlKey || evt.shiftKey) return false
    if (evt.defaultPrevented) return false

    // ensure link
    let el = evt.target
    while (el && 'A' !== el.nodeName) el = el.parentNode
    if (!el || 'A' !== el.nodeName) return false

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external')
        return false

    // check target
    if (el.target) return false

    if (!el.href) return false

    return true
}

export const onClick = router => evt => {
    let el = evt.target
    while (el && 'A' !== el.nodeName) el = el.parentNode
    const routeMatch = router.matchUrl(el.href)

    if (routeMatch) {
        evt.preventDefault()
        var name = routeMatch.name
        var params = routeMatch.params
        return ['navigate', name, params]
    } else {
        throw new Error(
            `[router5 driver] Could not match clicked hyplink href ${
                evt.target.href
            } to any known route`
        )
    }
}
