import { SFC, ComponentType } from 'react'
import { RouteContext } from '../types'
declare function withRoute<P>(
    BaseComponent: ComponentType<P & RouteContext>
): SFC<P>
export default withRoute
