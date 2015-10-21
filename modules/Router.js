import React, { Component, PropTypes, Children } from 'react';

export default class Router extends Component {
    constructor(props, context) {
        super(props, context);
        this.router = props.router;
    }

    getChildContext() {
        return { router: this.router };
    }

    componentWillReceiveProps(nextProps) {
        const { store } = this;
        const { store: nextStore } = nextProps;

        if (router !== nextRouter) {
            console.error('[react-router5][Router]does not support changing the router object.');
        }
    }

    render() {
        const { children } = this.props;
        return Children.only(children);
    }
}

Router.propTypes = {
    router:   PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
};

Router.childContextTypes = {
    router:   PropTypes.object.isRequired
};
