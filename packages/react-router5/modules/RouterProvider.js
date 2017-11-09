import { Component, Children } from 'react'
import PropTypes from 'prop-types'

class RouterProvider extends Component {
    constructor(props, context) {
        super(props, context)
        this.router = props.router
    }

    getChildContext() {
        return { router: this.router }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.router !== nextProps.router) {
            console.error(
                '[react-router5][RouterProvider] does not support changing the router object.'
            )
        }
    }

    render() {
        const { children } = this.props
        return Children.only(children)
    }
}

RouterProvider.propTypes = {
    router: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
}

RouterProvider.childContextTypes = {
    router: PropTypes.object.isRequired
}

export default RouterProvider
