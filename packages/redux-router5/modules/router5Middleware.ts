import * as actionTypes from './actionTypes'
import reduxPlugin from './reduxPlugin'
import { Router } from 'router5'

const router5ReduxMiddleware = (router: Router) => store => {
    const { dispatch } = store
    router.setDependency('store', store)
    router.usePlugin(reduxPlugin(dispatch))

    return next => action => {
        switch (action.type) {
            case actionTypes.NAVIGATE_TO:
                router.navigate(
                    action.payload.name,
                    action.payload.params,
                    action.payload.opts
                )
                break

            case actionTypes.CANCEL_TRANSITION:
                router.cancel()
                break

            case actionTypes.CAN_DEACTIVATE:
                router.canDeactivate(
                    action.payload.name,
                    action.payload.canDeactivate
                )
                break

            case actionTypes.CAN_ACTIVATE:
                router.canActivate(
                    action.payload.name,
                    action.payload.canDeactivate
                )
                break

            default:
                return next(action)
        }
    }
}

export default router5ReduxMiddleware
