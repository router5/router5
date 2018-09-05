export function nameToIDs(name) {
    return name.split('.').reduce(function(ids, name) {
        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name)
    }, [])
}

function exists(val) {
    return val !== undefined && val !== null
}

function hasMetaParams(state) {
    return state && state.meta && state.meta.params
}

function extractSegmentParams(name, state) {
    if (!hasMetaParams(state) || !exists(state.meta.params[name])) return {}

    return Object.keys(state.meta.params[name]).reduce((params, p) => {
        params[p] = state.params[p]
        return params
    }, {})
}

export default function transitionPath(toState, fromState) {
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

            if (leftParams.length !== rightParams.length) return i
            if (leftParams.length === 0) continue

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
    if (!fromState) {
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
