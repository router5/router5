import React from 'react'

export default linkFactory

let linkFactory = (router) => {
    return React.createClass({
        propTypes: {
            routeName:    React.PropTypes.string.isRequired
            routeParams:  React.PropTypes.object,
            routeOptions: React.PropTypes.object,
            activeClass:  React.PropTypes.string,
            onClick:      React.PropTypes.func
        },

        getDefaultProps() ({
            className: '',
            activeClass: 'active',
            routeParams: {},
            routeOptions: {},
            onClick: this.clickHandler
        }),

        getInitialState() ({
            // Initialise state
            // Not an anti-pattern
            // https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
            active: router.isActive(this.props.routeName, this.prop.routeParams)
        }),

        // Is it overkill?
        shouldComponentUpdate(nextProps, nextState) {
            return !router.areStatesEqual(
                {name: nextProps.routeName,  params: nextProps.routeParams},
                {name: this.props.routeName, params: this.props.routeParams}
            ) || this.state.active !== nextState.active;
        },

        clickHandler(evt) {
            evt.preventDefault()
            router.navigate(this.props.routeName, this.props.routeParams, this.props.options)
        },

        // Is it overkill?
        // Should it be an option to observe state in Links?
        // Should we add a GroupLink component for menus?
        routeChangeHandler(toState, fromState) {
            this.setState({active: router.isActive(this.props.routeName, this.prop.routeParams)})
        },

        componentDidMount() {
            router.addListener(this.routeChangeHandler)
        },

        componentWillUnmount() {
            router.removeListener(this.routeChangeHandler)
        }

        render() {
            let props = this.props
            let active = this.state.active

            let path =  router.buildPath(this.props.routeName, this.props.routeParams);
            let className = props.className.split(' ')
                .concat(active ? [activeClassName] : []).join(' ')

            return <a href={path} className={className} onClick={props.onClick}></a>
        }
    })
}
