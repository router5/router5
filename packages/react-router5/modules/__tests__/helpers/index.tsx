import createRouter from 'router5'
import React, { Component } from 'react'
import { RouterProvider } from '../../'
import { mount } from 'enzyme'
import browserPlugin from '../../../../router5-plugin-browser'

export class Child extends Component {
    render() {
        return <div />
    }
}

export const FnChild = () => <div />

export const createTestRouter = () => {
    const router = createRouter([])
    router.usePlugin(browserPlugin())
    return router
}

export const createTestRouterWithADefaultRoute = () => {
    const router = createRouter(
        [
            {
                name: 'test',
                path: '/'
            }
        ],
        { defaultRoute: 'test' }
    )
    router.usePlugin(
        browserPlugin({
            useHash: true
        })
    )
    return router
}

export const renderWithRouter = router => BaseComponent =>
    mount(
        <RouterProvider router={router}>
            <BaseComponent />
        </RouterProvider>
    )
