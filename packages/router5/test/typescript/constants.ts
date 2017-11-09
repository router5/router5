/// <reference path="../../index.d.ts" />

import { constants, errorCodes } from 'router5'

let c: string

c = constants.UNKNOWN_ROUTE
c = constants.ROUTER_START
c = constants.ROUTER_STOP
c = constants.TRANSITION_START
c = constants.TRANSITION_CANCEL
c = constants.TRANSITION_SUCCESS
c = constants.TRANSITION_ERROR

c = errorCodes.ROUTER_NOT_STARTED
c = errorCodes.NO_START_PATH_OR_STATE
c = errorCodes.ROUTER_ALREADY_STARTED
c = errorCodes.ROUTE_NOT_FOUND
c = errorCodes.SAME_STATES
c = errorCodes.CANNOT_DEACTIVATE
c = errorCodes.CANNOT_ACTIVATE
c = errorCodes.TRANSITION_ERR
c = errorCodes.TRANSITION_CANCELLED
