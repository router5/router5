import React from 'react'

export default linkFactory

function linkFactory(router) {
    return React.createClass({
        propTypes: {
            routeName:       React.PropTypes.string.isRequired,
            routeParams:     React.PropTypes.object,
            routeOptions:    React.PropTypes.object,
            activeClassName: React.PropTypes.string,
            activeStrict:    React.PropTypes.bool,
            onClick:         React.PropTypes.func
        },

        getDefaultProps() {
            return {
                activeClassName: 'active',
                activeStrict:    false,
                routeParams:     {},
                routeOptions:    {}
            };
        },

        getInitialState() {
            // Initialise state
            // Not an anti-pattern
            // https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
            return {
                active: router.isActive(this.props.routeName, this.props.routeParams, this.props.activeStrict)
            };
        },

        // Is it overkill?
        shouldComponentUpdate(nextProps, nextState) {
            return !router.areStatesEqual(
                {name: nextProps.routeName,  params: nextProps.routeParams},
                {name: this.props.routeName, params: this.props.routeParams}
            ) || this.state.active !== nextState.active;
        },

        clickHandler(evt) {
            if (!evt.nativeEvent.which === 2) {
                evt.preventDefault()
                router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions)
            }
        },

        // Is it overkill?
        // Should it be an option to observe state in Links?
        // Should we add a GroupLink component for menus?
        routeChangeHandler(toState, fromState) {
            this.setState({active: router.isActive(this.props.routeName, this.props.routeParams)})
        },

        componentDidMount() {
            router.addListener(this.routeChangeHandler)
        },

        componentWillUnmount() {
            router.removeListener(this.routeChangeHandler)
        },

        render() {
            let props = this.props
            let active = this.state.active

            let href =  router.buildUrl(props.routeName, props.routeParams)
            let className = (props.className ? props.className.split(' ') : [])
                .concat(active ? [props.activeClassName] : []).join(' ')
            let onClick = props.onClick || this.clickHandler

            return React.createElement('a', {href, className, onClick}, props.children)
        }
    })
}
