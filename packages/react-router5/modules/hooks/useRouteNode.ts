import { shouldUpdateNode } from 'router5-transition-path'
import { useContext, useEffect, useState } from 'react'
import { routerContext } from '../context'
import { RouteContext } from '../types'

export type UnsubscribeFn = () => void

export default function useRouter(nodeName: string): RouteContext {
    const router = useContext(routerContext)

    const [state, setState] = useState(() => ({
        previousRoute: null,
        route: router.getState()
    }))

    useEffect(
        () =>
            router.subscribe(({ route, previousRoute }) => {
                const shouldUpdate = shouldUpdateNode(nodeName)(
                    route,
                    previousRoute
                )

                if (shouldUpdate) {
                    setState({
                        route,
                        previousRoute
                    })
                }
            }) as UnsubscribeFn,
        []
    )

    return { router, ...state }
}
