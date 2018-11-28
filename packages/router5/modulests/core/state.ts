import { Router } from '../types/router'
import { State } from '../types/base'
import { constants } from '../constants'

export default function withState(router: Router): Router {
    let stateId: number = 0
    let routerState: State | null = null

    router.getState = () => routerState

    router.setState = state => {
        routerState = state
    }

    router.makeState = (name, params, path, meta, forceId) => ({
        name,
        params: {
            ...router.config.defaultParams[name],
            ...params
        },
        path,
        meta: meta
            ? {
                  ...meta,
                  id: forceId === undefined ? ++stateId : forceId
              }
            : undefined
    })

    router.makeNotFoundState = (path, options) =>
        router.makeState(constants.UNKNOWN_ROUTE, { path }, path, {
            options
        })

    router.areStatesEqual = (state1, state2, ignoreQueryParams = true) => {
        if (state1.name !== state2.name) return false

        const getUrlParams = name =>
            router.rootNode
                //@ts-ignore
                .getSegmentsByName(name)
                .map(segment => segment.parser['urlParams'])
                .reduce((params, p) => params.concat(p), [])

        const state1Params = ignoreQueryParams
            ? getUrlParams(state1.name)
            : Object.keys(state1.params)
        const state2Params = ignoreQueryParams
            ? getUrlParams(state2.name)
            : Object.keys(state2.params)

        return (
            state1Params.length === state2Params.length &&
            state1Params.every(p => state1.params[p] === state2.params[p])
        )
    }

    router.areStatesDescendants = (parentState, childState) => {
        const regex = new RegExp('^' + parentState.name + '\\.(.*)$')
        if (!regex.test(childState.name)) return false
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(
            p => parentState.params[p] === childState.params[p]
        )
    }

    router.forwardState = (routeName, routeParams) => {
        const name = router.config.forwardMap[routeName] || routeName
        const params = {
            ...router.config.defaultParams[routeName],
            ...router.config.defaultParams[name],
            ...routeParams
        }

        return {
            name,
            params
        }
    }

    router.buildState = (routeName, routeParams) => {
        const { name, params } = forwardState(routeName, routeParams)

        return router.rootNode.buildState(name, params)
    }

    return router
}
