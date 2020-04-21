import React, { ComponentType } from 'react'
import { Router } from 'router5'
import { routerContext } from '../context'

function withRouter<P>(
    BaseComponent: ComponentType<P & { router: Router }>
): ComponentType<Omit<P, 'router'>> {
    return function WithRouter(props: P) {
        return (
            <routerContext.Consumer>
                {router => <BaseComponent {...props} router={router} />}
            </routerContext.Consumer>
        )
    }
}

export default withRouter
