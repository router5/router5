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

export const FnChild = props => <div />

export const createTestRouter = () => {
    const router = createRouter([])
    router.usePlugin(browserPlugin())
    return router
}

export const renderWithRouter = router => BaseComponent =>
    mount(
        <RouterProvider router={router}>
            <BaseComponent />
        </RouterProvider>
    )
