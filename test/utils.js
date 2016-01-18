import Router5 from 'router5';
import React, { Component, PropTypes } from 'react';
import { RouterProvider } from '../modules';
import { renderIntoDocument } from 'react-addons-test-utils';

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

export const renderWithRouter = router => BaseComponent => renderIntoDocument(
    <RouterProvider router={ router }>
        <BaseComponent />
    </RouterProvider>
);
