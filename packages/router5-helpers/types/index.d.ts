export interface State {
    name: string
    params?: {
        [key: string]: any
    }
    [key: string]: any
}
export interface SegmentTestFunction {
    (route: string | State, segment: string): boolean
    (route: string | State): (segment: string) => boolean
}
export declare const startsWithSegment: SegmentTestFunction
export declare const endsWithSegment: SegmentTestFunction
export declare const includesSegment: SegmentTestFunction
