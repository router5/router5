declare module 'router5-transition-path' {
    import { State } from 'router5'

    export function nameToIDs(name: string): string[]

    export interface TransitionPath {
        intersection: string
        toDeactivate: string[]
        toActivate: string[]
    }

    function transitionPath(toState: State, fromState?: State): TransitionPath

    export default transitionPath
}
