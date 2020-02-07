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
    render():
        | string
        | number
        | boolean
        | {}
        | import('react').ReactElement<
              any,
              | string
              | ((
                    props: any
                ) => import('react').ReactElement<
                    any,
                    | string
                    | any
                    | (new (props: any) => Component<any, any, any>)
                >)
              | (new (props: any) => Component<any, any, any>)
          >
        | import('react').ReactPortal
}
export default RouterProvider
