export interface ErrorCodes {
    ROUTER_NOT_STARTED: string
    NO_START_PATH_OR_STATE: string
    ROUTER_ALREADY_STARTED: string
    ROUTE_NOT_FOUND: string
    SAME_STATES: string
    CANNOT_DEACTIVATE: string
    CANNOT_ACTIVATE: string
    TRANSITION_ERR: string
    TRANSITION_CANCELLED: string
}
export interface Constants {
    UNKNOWN_ROUTE: string
    ROUTER_START: string
    ROUTER_STOP: string
    TRANSITION_START: string
    TRANSITION_CANCEL: string
    TRANSITION_SUCCESS: string
    TRANSITION_ERROR: string
}
export declare const errorCodes: ErrorCodes
export declare const constants: Constants
