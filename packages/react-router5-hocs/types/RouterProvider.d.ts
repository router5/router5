import { Component, ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'router5'
interface RouterProviderProps {
    router?: Router
    children: ReactNode
}
declare class RouterProvider extends Component<RouterProviderProps> {
    static childContextTypes: {
        router: PropTypes.Validator<object>
    }
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
