import { Component, Children, ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'router5'

interface RouterProviderProps {
    router?: Router
    children: ReactNode
}

class RouterProvider extends Component<RouterProviderProps> {
    private router: Router

    constructor(props, context) {
        super(props, context)
        this.router = props.router
    }

    getChildContext() {
        return { router: this.router }
    }

    render() {
        const { children } = this.props
        return Children.only(children)
    }
}

RouterProvider.childContextTypes = {
    router: PropTypes.object.isRequired
}

export default RouterProvider
