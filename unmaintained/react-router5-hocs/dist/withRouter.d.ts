import { ComponentClass, ComponentType } from 'react';
import { Router } from 'router5';
declare function withRouter<P>(BaseComponent: ComponentType<P & {
    router: Router;
}>): ComponentClass<P>;
export default withRouter;
