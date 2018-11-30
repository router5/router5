import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { shouldUpdateNode } from 'router5-transition-path'
import { State, Router } from 'router5'
import { RouterContext, RouterState, UnsubscribeFn } from './types';

const emptyCreateContext = () => ({
    Provider: ({ children }) => children,
    Consumer: () => null
})


const createContext = React.createContext || emptyCreateContext
//@ts-ignore
const { Provider, Consumer: Route } = createContext<RouterContext>({})

export interface RouteProviderProps {
    router: Router
    children: ReactNode
}

class RouteProvider extends React.PureComponent<RouteProviderProps> {
    private mounted: boolean
    private router: Router
    private routeState: RouterState
    private unsubscribe: UnsubscribeFn

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
            this.unsubscribe = this.router.subscribe(listener) as UnsubscribeFn
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

export interface RouteNodeProps {
    nodeName: string
    children: (routeContext: RouterContext) => ReactNode
}

class RouteNode extends React.Component<RouteNodeProps> {
    private memoizedResult: ReactNode

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

export { RouteProvider, Route, RouteNode }
