import {
    createTestRouter,
    FnChild,
    renderWithRouter,
    createTestRouterWithADefaultRoute
} from './helpers'
import { withRoute, withRouter, routeNode } from '..'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

//@ts-ignore
configure({ adapter: new Adapter() })

describe('withRoute hoc', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = jest.fn(FnChild)

        renderWithRouter(router)(withRoute(ChildSpy))
        expect(ChildSpy).toHaveBeenCalledWith(
            {
                router,
                route: null,
                previousRoute: null
            },
            {}
        )
    })
})

describe('withRouter hoc', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should inject the router on the wrapped component props', () => {
        const ChildSpy = jest.fn(FnChild)

        //@ts-ignore
        renderWithRouter(router)(withRouter(ChildSpy))

        expect(ChildSpy).toHaveBeenCalledWith(
            {
                router
            },
            {}
        )
    })
})

describe('routeNode hoc', () => {
    let router
    let routerWithADefaultRoute

    beforeAll(() => {
        router = createTestRouter()
        routerWithADefaultRoute = createTestRouterWithADefaultRoute()
    })

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = jest.fn(FnChild)

        renderWithRouter(router)(routeNode('')(ChildSpy))
        expect(ChildSpy).toHaveBeenCalledWith(
            {
                router,
                route: null,
                previousRoute: null
            },
            {}
        )
    })

    it('Route should not be null with a default route and the router started', () => {
        const ChildSpy = jest.fn(FnChild)

        const BaseComponent = routeNode('')(ChildSpy)

        routerWithADefaultRoute.start(() => {
            renderWithRouter(routerWithADefaultRoute)(BaseComponent)
            /* first call, first argument */
            expect(ChildSpy.mock.calls[0][0].route.name).toBe('test')
        })
    })
})
