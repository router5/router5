import { NavigationOptions, State } from 'router5'
export declare function navigateTo(
    name: string,
    params?: {
        [key: string]: any
    },
    opts?: NavigationOptions
): {
    type: string
    payload: {
        name: string
        params: {
            [key: string]: any
        }
        opts: NavigationOptions
    }
}
export declare function cancelTransition(): {
    type: string
}
export declare function clearErrors(): {
    type: string
}
export declare function transitionStart(
    route: State,
    previousRoute: State | null
): {
    type: string
    payload: {
        route: State
        previousRoute: State
    }
}
export declare function transitionSuccess(
    route: State,
    previousRoute: State | null
): {
    type: string
    payload: {
        route: State
        previousRoute: State
    }
}
export declare function transitionError(
    route: State,
    previousRoute: State | null,
    transitionError: any
): {
    type: string
    payload: {
        route: State
        previousRoute: State
        transitionError: any
    }
}
export declare function canActivate(
    name: string,
    canActivate: boolean
): {
    type: string
    payload: {
        name: string
        canActivate: boolean
    }
}
export declare function canDeactivate(
    name: string,
    canDeactivate: boolean
): {
    type: string
    payload: {
        name: string
        canDeactivate: boolean
    }
}
