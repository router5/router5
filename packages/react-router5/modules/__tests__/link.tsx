import React from 'react'
import { createTestRouter } from './helpers'
import { RouterProvider, Link, ConnectedLink } from '..'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

//@ts-ignore
configure({ adapter: new Adapter() })

describe('Link component', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should render an hyperlink element', () => {
        router.addNode('home', '/home')
        const output = mount(
            <RouterProvider router={router}>
                <Link routeName={'home'} />
            </RouterProvider>
        )
        expect(output.find('a').prop('href')).toBe('/home')
        expect(output.find('a').prop('className')).not.toContain('active')
    })

    it('should have an active class if associated route is active', () => {
        router.setOption('defaultRoute', 'home')
        router.start()
        const output = mount(
            <RouterProvider router={router}>
                <Link routeName={'home'} />
            </RouterProvider>
        )
        expect(output.find('a').prop('className')).toContain('active')
    })

    it('should not call router’s navigate method when used with target="_blank"', () => {
        router.start()
        const output = mount(
            <RouterProvider router={router}>
                <ConnectedLink routeName="home" title="Hello" target="_blank" />
            </RouterProvider>
        )
        const a = output.find('a')
        const navSpy = jest.spyOn(router, 'navigate')

        a.simulate('click')

        expect(a.prop('target')).toBeDefined()
        expect(navSpy).not.toHaveBeenCalled()
    })

    it('should spread other props to its link', () => {
        router.start()
        const onMouseLeave = () => {}
        const output = mount(
            <RouterProvider router={router}>
                <ConnectedLink
                    routeName={'home'}
                    title="Hello"
                    data-test-id="Link"
                    onMouseLeave={onMouseLeave}
                />
            </RouterProvider>
        )

        const props = output.find('a').props()

        expect(props).toEqual({
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
