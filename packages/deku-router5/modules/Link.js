const Link = {
    propTypes: {
        router: { source: 'router' },
        route: { source: 'route' },
        button: { type: 'boolean' },
        routeName: { type: 'string', optional: false },
        routeParams: { type: 'object' },
        routeOptions: { type: 'object' },
        activeClass: { type: 'string' },
        activeStrict: { type: 'function' },
        onClick: { type: 'function' }
    },

    defaultProps: {
        activeClass: 'active',
        button: false,
        activeStrict: false,
        routeParams: {},
        routeOptions: {}
    },

    render({ props }) {
        const {
            button,
            activeClass,
            routeName,
            routeParams,
            routeOptions,
            children,
            router
        } = props

        const clickHandler = evt => {
            evt.preventDefault()
            router.navigate(routeName, routeParams, routeOptions)
        }

        const active = router.isActive(routeName, routeParams)
        const href = router.buildUrl(routeName, routeParams)

        const className = (props.class ? props.class.split(' ') : [])
            .concat(active ? [activeClass] : [])
            .join(' ')

        const onClick = props.onClick || clickHandler

        if (button) {
            return {
                type: 'button',
                children,
                attributes: { type: 'button', class: className, onClick }
            }
        }

        return {
            type: 'a',
            children,
            attributes: { href, class: className, onClick }
        }
    }
}

export default Link
