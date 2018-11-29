import { Router } from '../types/router'
import { State, NavigationOptions, DoneFn } from '../types/base'
export default function transition(
    router: Router,
    toState: State,
    fromState: State | null,
    opts: NavigationOptions,
    callback: DoneFn
): () => void
