import React, { Component, PropTypes } from 'react';

export default Link;

class Link extends Component {
    constructor(props, context) {
        super(props, context);
        this.router = context.router;
    }

    clickHandler(evt) {
        if (this.props.onClick) {
            this.props.onClick(evt);

            if (evt.defaultPrevented) {
                return;
            }
        }

        let comboKey = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

        if (evt.button === 0 && !comboKey) {
            evt.preventDefault();
            router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
        }
    }

    routeChangeHandler(toState, fromState) {
        this.setState({active: router.isActive(this.props.routeName, this.props.routeParams)});
    }

    componentDidMount() {
        router.addListener(this.routeChangeHandler);
    }

    componentWillUnmount() {
        router.removeListener(this.routeChangeHandler);
    }

    render() {
        const { routeName, routeParams, className, activeClassName } = this.props;
        const { active } = this.state;

        const href =  this.router.buildUrl(routeName, routeParams);
        const linkclassName = (className ? className.split(' ') : [])
            .concat(active ? [activeClassName] : []).join(' ');

        const onClick = this.clickHandler;

        return React.createElement('a', {href, className: linkclassName, onClick}, props.children);
    }
}

Link.contextTypes = {
    router: PropTypes.object.isRequired
};

Link.propTypes = {
    routeName:       PropTypes.string.isRequired,
    routeParams:     PropTypes.object,
    routeOptions:    PropTypes.object,
    activeClassName: PropTypes.string,
    activeStrict:    PropTypes.bool,
    onClick:         PropTypes.func
};

Link.defaultProps = {
    activeClassName: 'active',
    activeStrict:    false,
    routeParams:     {},
    routeOptions:    {}
};
