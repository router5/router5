import React from 'react'
import PropTypes from 'prop-types'
import transitionPath from 'router5-transition-path'
import { ifNot } from './utils'

const emptyCreateContext = () => ({
    Provider: _ => _,
    Consumer: () => null
})
const createContext = React.createContext || emptyCreateContext

const { Provider, Consumer: Route } = createContext({
    route: null,
    previousRoute: null
})

class RouteProvider extends React.PureComponent {
    constructor(props) {
        super(props)
        const { router } = props

        this.state = {
            route: router.getState()
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

        this.listener = (toState, fromState) =>
            this.setState({ previousRoute: fromState, route: toState })
        this.router.addListener(this.listener)
    }

    componentWillUnmount() {
        this.router.removeListener(this.listener)
    }

    getChildContext() {
        return { router: this.router }
    }

    render() {
        return (
            <Provider value={this.state.route}>{this.props.children}</Provider>
        )
    }
}

RouteProvider.childContextTypes = {
    router: PropTypes.object.isRequired
}

RouteProvider.propTypes = {
    router: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
}

class RouteNodeConsumer extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { intersection } = transitionPath(
            nextProps.routeContext.route,
            nextProps.routeContext.previousRoute
        )

        return intersection === nextProps.nodeName
    }

    render() {
        return this.props.children(this.props.routeContext)
    }
}

RouteNodeConsumer.propTypes = {
    nodeName: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired
}

function RouteNode(props) {
    return (
        <Route>
            {routeContext => (
                <RouteNodeConsumer {...props} routeContext={routeContext} />
            )}
        </Route>
    )
}

export { RouteProvider, Route, RouteNode }
