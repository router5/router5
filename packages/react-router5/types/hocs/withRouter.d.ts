import { SFC, ComponentType } from 'react'
import { Router } from 'router5'
declare function withRouter<P>(
    BaseComponent: ComponentType<
        P & {
            router: Router
        }
    >
): SFC<Exclude<P, 'router'>>
export default withRouter
