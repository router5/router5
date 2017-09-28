declare module "rxjs-router5" {
    import * as Rx from "rxjs";
    import { State, Router } from "router5";
    interface RouterObservables {
        route$: Rx.Observable<State>;
        routeNode: () => Rx.Observable<State>;
        transitionError$: Rx.Observable<any>;
        transitionRoute$: Rx.Observable<State>;
    }
    export default function createObservables(router: Router): RouterObservables;
}
