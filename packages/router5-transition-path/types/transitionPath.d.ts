export interface SegementParams {
    [key: string]: string
}
export interface State {
    name: string
    params?: {
        [key: string]: any
    }
    meta?: {
        options?: {
            [key: string]: boolean
        }
        params?: {
            [key: string]: SegementParams
        }
    }
    [key: string]: any
}
export interface TransitionPath {
    intersection: string
    toDeactivate: string[]
    toActivate: string[]
}
export declare const nameToIDs: (name: string) => string[]
export default function transitionPath(
    toState: State,
    fromState: State | null
): TransitionPath
