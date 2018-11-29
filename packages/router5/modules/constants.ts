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

export const errorCodes: ErrorCodes = {
    ROUTER_NOT_STARTED: 'NOT_STARTED',
    NO_START_PATH_OR_STATE: 'NO_START_PATH_OR_STATE',
    ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
    SAME_STATES: 'SAME_STATES',
    CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
    CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
    TRANSITION_ERR: 'TRANSITION_ERR',
    TRANSITION_CANCELLED: 'CANCELLED'
}

export const constants: Constants = {
    UNKNOWN_ROUTE: '@@router5/UNKNOWN_ROUTE',
    ROUTER_START: '$start',
    ROUTER_STOP: '$stop',
    TRANSITION_START: '$$start',
    TRANSITION_CANCEL: '$$cancel',
    TRANSITION_SUCCESS: '$$success',
    TRANSITION_ERROR: '$$error'
}
