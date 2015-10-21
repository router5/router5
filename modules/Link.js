import React, { Component, PropTypes } from 'react';

export default Link;

class Link extends Component {
    constructor(props, context) {
        super(props, context);
        this.router = context.router;

        this.isActive = this.isActive.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.routeChangeHandler = this.routeChangeHandler.bind(this);

        this.state = { active: this.isActive() };
    }

    isActive() {
        return this.router.isActive(this.props.routeName, this.props.routeParams)
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
            this.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
        }
    }

    routeChangeHandler(toState, fromState) {
        this.setState({active: this.isActive()});
    }

    componentDidMount() {
        this.router.addListener(this.routeChangeHandler);
    }

    componentWillUnmount() {
        this.router.removeListener(this.routeChangeHandler);
    }

    render() {
        const { routeName, routeParams, className, activeClassName, children } = this.props;
        const { active } = this.state;

        const href =  this.router.buildUrl(routeName, routeParams);
        const linkclassName = (className ? className.split(' ') : [])
            .concat(active ? [activeClassName] : []).join(' ');

        const onClick = this.clickHandler;

        return React.createElement('a', {href, className: linkclassName, onClick}, children);
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
