import { ComponentClass } from 'react'
import { Router } from 'router5'
declare function withRouter<P>(
    BaseComponent: ComponentClass<
        P,
        {
            router: Router
        }
    >
): ComponentClass<P>
export default withRouter
