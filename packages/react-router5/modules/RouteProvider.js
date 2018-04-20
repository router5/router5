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

        this.router = router
        this.state = {
            route: router.getState(),
            previousRoute: null,
            router
        }
    }

    componentDidMount() {
        const listener = (toState, fromState) => {
            this.setState({
                route: toState,
                previousRoute: fromState
            })
        }
        this.unsubscribe = this.router.subscribe(listener)
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    getChildContext() {
        return { router: this.props.router }
    }

    render() {
        return <Provider value={this.state}>{this.props.children}</Provider>
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
