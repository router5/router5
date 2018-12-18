import { Component, ReactNode } from 'react'
import { Router } from 'router5'
interface RouterProviderProps {
    router?: Router
    children: ReactNode
}
declare class RouterProvider extends Component<RouterProviderProps> {
    private router
    constructor(props: any, context: any)
    getChildContext(): {
        router: Router
    }
    render(): import('react').ReactElement<any>
}
export default RouterProvider
