import { createTestRouter, FnChild, renderWithRouter } from './helpers'
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

// describe('routeNode hoc', () => {
//     let router

//     beforeAll(() => {
//         router = createTestRouter()
//     })

//     it('should inject the router in the wrapped component props', () => {
//         const ChildSpy = jest.fn(FnChild)

//         renderWithRouter(router)(routeNode('')(ChildSpy))
//         expect(ChildSpy).toHaveBeenCalledWith({
//             router,
//             route: null,
//             previousRoute: null
//         }, {})
//     })
// })
