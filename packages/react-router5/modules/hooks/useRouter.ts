import { useContext } from 'react'
import { routerContext } from '../context'
import { Router } from 'router5'

export default function useRouter(): Router {
    return useContext(routerContext)
}
