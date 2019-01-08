import { useContext } from 'react'
import { routeContext } from '../context'
import { RouteContext } from '../types'

export default function useRoute(): RouteContext {
    return useContext(routeContext)
}
