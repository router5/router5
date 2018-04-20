import React from 'react'
import { expect } from 'chai'
import { Child, createTestRouter, FnChild, renderWithRouter } from './utils'
import {
    RouterProvider,
    withRoute,
    routeNode,
    BaseLink,
    Link
} from '../modules'
import { spy } from 'sinon'
import listenersPlugin from '../../router5/plugins/listeners'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('withRoute hoc', () => {
    let router

    before(() => {
        router = createTestRouter()
    })

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = spy(FnChild)
        router.usePlugin(listenersPlugin())

        const tree = renderWithRouter(router)(withRoute(ChildSpy))
        expect(ChildSpy).to.have.been.calledWith({
            router,
            route: null,
            previousRoute: null
        })
    })
})

describe('routeNode hoc', () => {
    let router

    before(() => {
        router = createTestRouter()
    })

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = spy(FnChild)
        router.usePlugin(listenersPlugin())
        const tree = renderWithRouter(router)(withRoute(ChildSpy))
        expect(ChildSpy).to.have.been.calledWith({
            router,
            route: null,
            previousRoute: null
        })
    })
})

describe('BaseLink component', () => {
    let router

    before(() => {
        router = createTestRouter()
    })

    it('should render an hyperlink element', () => {
        router.addNode('home', '/home')
        const output = mount(
            <RouterProvider router={router}>
                <BaseLink routeName={'home'} />
            </RouterProvider>
        )
        expect(output.find('a')).to.have.attr('href', '/home')
        expect(output.find('a')).not.to.have.className('active')
    })

    it('should have an active class if associated route is active', () => {
        router.setOption('defaultRoute', 'home')
        router.start()
        const output = mount(
            <RouterProvider router={router}>
                <BaseLink routeName={'home'} />
            </RouterProvider>
        )
        expect(output.find('a')).to.have.className('active')
    })

    it('should spread other props to its link', () => {
        router.usePlugin(listenersPlugin())
        router.start()
        const onMouseLeave = () => {}
        const output = mount(
            <RouterProvider router={router}>
                <Link
                    routeName={'home'}
                    title="Hello"
                    data-test-id="Link"
                    onMouseLeave={onMouseLeave}
                />
            </RouterProvider>
        )

        const props = output.find('a').props()

        expect(props).to.eql({
            href: '/home',
            className: 'active',
            onClick: props.onClick,
            title: 'Hello',
            'data-test-id': 'Link',
            onMouseLeave,
            children: undefined
        })
    })
})
