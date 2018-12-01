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

export const nameToIDs = (name: string): string[] =>
    name
        .split('.')
        .reduce(
            (ids: string[], name: string) =>
                ids.concat(
                    ids.length ? ids[ids.length - 1] + '.' + name : name
                ),
            []
        )

const exists = val => val !== undefined && val !== null

const hasMetaParams = state => state && state.meta && state.meta.params

const extractSegmentParams = (name: string, state: State): SegementParams => {
    if (!hasMetaParams(state) || !exists(state.meta.params[name])) return {}

    return Object.keys(state.meta.params[name]).reduce((params, p) => {
        params[p] = state.params[p]
        return params
    }, {})
}

export default function transitionPath(
    toState: State,
    fromState: State | null
): TransitionPath {
    const toStateOptions =
        (toState.meta && toState.meta && toState.meta.options) || {}
    const fromStateIds = fromState ? nameToIDs(fromState.name) : []
    const toStateIds = nameToIDs(toState.name)
    const maxI = Math.min(fromStateIds.length, toStateIds.length)

    function pointOfDifference() {
        let i
        for (i = 0; i < maxI; i += 1) {
            const left = fromStateIds[i]
            const right = toStateIds[i]

            if (left !== right) return i

            const leftParams = extractSegmentParams(left, toState)
            const rightParams = extractSegmentParams(right, fromState)

            if (
                Object.keys(leftParams).length !==
                Object.keys(rightParams).length
            )
                return i
            if (Object.keys(leftParams).length === 0) continue

            const different = Object.keys(leftParams).some(
                p => rightParams[p] !== leftParams[p]
            )
            if (different) {
                return i
            }
        }

        return i
    }

    let i
    if (!fromState || toStateOptions.reload) {
        i = 0
    } else if (!hasMetaParams(fromState) && !hasMetaParams(toState)) {
        i = 0
    } else {
        i = pointOfDifference()
    }

    const toDeactivate = fromStateIds.slice(i).reverse()
    const toActivate = toStateIds.slice(i)

    const intersection = fromState && i > 0 ? fromStateIds[i - 1] : ''

    return {
        intersection,
        toDeactivate,
        toActivate
    }
}
