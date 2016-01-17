import React from 'react';
import { expect } from 'chai';
import { Child, createRouter, FnChild } from './utils';
import { RouterProvider, withRoute, routeNode } from '../modules';
import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import { spy } from 'sinon';
import listeners from 'router5-listeners';

describe('RouterProvider component', () => {
    it('should add the store to the child context', () => {
        const router = createRouter();
        const tree = renderIntoDocument(
            <RouterProvider router={router}>
                <Child />
            </RouterProvider>
        );

        const child = findRenderedComponentWithType(tree, Child)
        expect(child.context.router).to.equal(router);
    });
});

describe('withRoute hoc', () => {
    let router;

    before(() => {
        router = createRouter();
    });

    it('should throw an error if router5-listeners plugin is not used', () => {
        const ComponentWithRoute = withRoute(() => <div />);
        const renderTree = () => renderIntoDocument(
            <RouterProvider router={router}>
                <ComponentWithRoute />
            </RouterProvider>
        );

        expect(renderTree).to.throw('[react-router5][withRoute] missing plugin router5-listeners');
    });

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = spy(FnChild);
        const ComponentWithRoute = withRoute(ChildSpy);
        router.usePlugin(listeners());

        const tree = renderIntoDocument(
            <RouterProvider router={router}>
                <ComponentWithRoute />
            </RouterProvider>
        );

        expect(ChildSpy).to.have.been.calledWith({ router, route: null, previousRoute: null });
    });
});

describe('routeNode hoc', () => {
    let router;

    before(() => {
        router = createRouter();
    });

    it('should throw an error if router5-listeners plugin is not used', () => {
        const NodeComponent = routeNode('')(Child);
        const renderTree = () => renderIntoDocument(
            <RouterProvider router={router}>
                <NodeComponent />
            </RouterProvider>
        );

        expect(renderTree).to.throw('[react-router5][routeNode] missing plugin router5-listeners');
    });

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = spy(FnChild);
        const NodeComponent = withRoute(ChildSpy);
        router.usePlugin(listeners());

        const tree = renderIntoDocument(
            <RouterProvider router={router}>
                <NodeComponent />
            </RouterProvider>
        );

        expect(ChildSpy).to.have.been.calledWith({ router, route: null, previousRoute: null });
    });
})
