import React from 'react'
import PropTypes from 'prop-types'
import { shouldUpdateNode } from 'router5-transition-path'

const emptyCreateContext = () => ({
    Provider: ({ children }) => children,
    Consumer: () => null
})

const createContext = React.createContext || emptyCreateContext

const { Provider, Consumer: Route } = createContext({})

class RouteProvider extends React.PureComponent {
    constructor(props) {
        super(props)
        const { router } = props
        this.mounted = false
        this.router = router
        this.routeState = {
            route: router.getState(),
            previousRoute: null
        }

        if (typeof window !== 'undefined') {
            const listener = ({ route, previousRoute }) => {
                this.routeState = {
                    route,
                    previousRoute
                }
                if (this.mounted) {
                    this.forceUpdate()
                }
            }
            this.unsubscribe = this.router.subscribe(listener)
        }
    }

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe()
        }
    }

    getChildContext() {
        return { router: this.props.router }
    }

    render() {
        const value = {
            router: this.props.router,
            ...this.routeState
        }
        return <Provider value={value}>{this.props.children}</Provider>
    }
}

RouteProvider.childContextTypes = {
    router: PropTypes.object.isRequired
}

RouteProvider.propTypes = {
    router: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
}

class RouteNode extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.renderOnRouteNodeChange = this.renderOnRouteNodeChange.bind(this)
    }

    renderOnRouteNodeChange(routeContext) {
        const shouldUpdate = shouldUpdateNode(this.props.nodeName)(
            routeContext.route,
            routeContext.previousRoute
        )

        if (!this.memoizedResult || shouldUpdate) {
            this.memoizedResult = this.props.children(routeContext)
        }

        return this.memoizedResult
    }

    render() {
        return <Route>{this.renderOnRouteNodeChange}</Route>
    }
}

RouteNode.propTypes = {
    nodeName: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired
}

export { RouteProvider, Route, RouteNode }
