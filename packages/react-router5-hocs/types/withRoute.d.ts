import { ComponentClass } from 'react'
import { RouterState } from './types'
declare function withRoute<P>(
    BaseComponent: React.ComponentType<P & RouterState>
): ComponentClass<P>
export default withRoute
