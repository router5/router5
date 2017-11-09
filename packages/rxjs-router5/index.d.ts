declare module 'rxjs-router5' {
    import * as Rx from 'rxjs'
    import { State, Router } from 'router5'
    interface RouterObservables {
        /// route$: an observable of your application route
        route$: Rx.Observable<State>

        /**
         * @param nodeName the name of a node
         * @returns an observable of route updates for the specified node.
         * See understanding router5: http://router5.github.io/docs/understanding-router5.html.
         */
        routeNode: (nodeName: string) => Rx.Observable<State>

        /// an observable of transition errors
        transitionError$: Rx.Observable<any>

        /// an observable of the currently transitioning route
        transitionRoute$: Rx.Observable<State>
    }
    export default function createObservables(router: Router): RouterObservables
}
