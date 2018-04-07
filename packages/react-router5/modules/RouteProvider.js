import React from 'react'
import PropTypes from 'prop-types'
import transitionPath from 'router5-transition-path'
import { ifNot } from './utils'

const emptyCreateContext = () => ({
    Provider: _ => _,
    Consumer: () => null
})

const createContext = React.createContext || emptyCreateContext

const { Provider, Consumer: Route } = createContext({})

class RouteProvider extends React.PureComponent {
    constructor(props) {
        super(props)
        const { router } = props

        this.state = {
            route: router.getState(),
            previousRoute: null,
            router
        }

        this.listener = this.listener.bind(this)
    }

    listener(toState, fromState) {
        this.setState({
            route: toState,
            previousRoute: fromState
        })
    }

    componentDidMount() {
        ifNot(
            this.router.hasPlugin('LISTENERS_PLUGIN'),
            '[react-router5][RouteProvider] missing listeners plugin'
        )

        this.router.addListener(this.listener)
    }

    componentWillUnmount() {
        this.router.removeListener(this.listener)
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
    renderOnRouteNodeChange = routeContext => {
        const { intersection } = transitionPath(
            routeContext.route,
            routeContext.previousRoute
        )

        if (!this.memoizedResult || intersection === this.props.nodeName) {
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
