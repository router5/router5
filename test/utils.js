import Router5 from 'router5';
import React, { Component, PropTypes } from 'react';

export class Child extends Component {
    render() {
        return <div />;
    }
}

Child.contextTypes = {
    router: PropTypes.object.isRequired
};

export const FnChild = (props) => <div />;

export const createRouter = () => new Router5();
