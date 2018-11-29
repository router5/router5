const dotOrEnd = '(\\..+$|$)'
const dotOrStart = '(^.+\\.|^)'

export interface State {
    name: string
    params?: {
        [key: string]: any
    }
    [key: string]: any
}

const getName = (route: State | string): string => {
    return typeof route === 'string' ? route : route.name || ''
}

const test = (route: State | string, regex: RegExp): boolean => {
    return regex.test(getName(route))
}

const normaliseSegment = (name: string): string => {
    return name.replace('.', '\\.')
}

const testRouteWithSegment = (start, end) => {
    return (...args) => {
        const route = args[0]

        const applySegment = segment => {
            return test(
                route,
                new RegExp(start + normaliseSegment(segment) + end)
            )
        }

        if (args.length === 2) {
            return applySegment(args[1])
        }

        return applySegment
    }
}

export interface SegmentTestFunction {
    (route: string | State, segment: string): boolean
    (route: string | State): (segment: string) => boolean
}
export const startsWithSegment: SegmentTestFunction = testRouteWithSegment(
    '^',
    dotOrEnd
) as SegmentTestFunction
export const endsWithSegment: SegmentTestFunction = testRouteWithSegment(
    dotOrStart,
    '$'
) as SegmentTestFunction
export const includesSegment: SegmentTestFunction = testRouteWithSegment(
    dotOrStart,
    dotOrEnd
) as SegmentTestFunction
