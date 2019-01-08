import { createTestRouter, FnChild, renderWithRouter } from './helpers'
import { useRoute, useRouter, useRouteNode } from '..'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

//@ts-ignore
configure({ adapter: new Adapter() })

describe('useRoute hook', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = jest.fn(FnChild)

        renderWithRouter(router)(() => {
            return ChildSpy(useRoute())
        })
        expect(ChildSpy).toHaveBeenCalledWith({
            router,
            route: null,
            previousRoute: null
        })
    })
})

describe('useRouter hook', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should inject the router on the wrapped component props', () => {
        const ChildSpy = jest.fn(FnChild)

        //@ts-ignore
        renderWithRouter(router)(() => {
            return ChildSpy({ router: useRouter() })
        })

        expect(ChildSpy).toHaveBeenCalledWith({
            router
        })
    })
})

describe('useRouteNode hook', () => {
    let router

    beforeAll(() => {
        router = createTestRouter()
    })

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = jest.fn(FnChild)

        renderWithRouter(router)(() => ChildSpy(useRouteNode('')))
        expect(ChildSpy).toHaveBeenCalledWith({
            router,
            route: null,
            previousRoute: null
        })
    })
})
