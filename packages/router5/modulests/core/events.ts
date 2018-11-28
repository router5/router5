import { Router } from '../types/router'

export default function withEvents(router: Router): Router {
    const callbacks = {}

    router.invokeEventListeners = (eventName, ...args) => {
        ;(callbacks[eventName] || []).forEach(cb => cb(...args))
    }

    router.removeEventListener = (eventName, cb) => {
        callbacks[eventName] = callbacks[eventName].filter(_cb => _cb !== cb)
    }

    router.addEventListener = (eventName, cb) => {
        callbacks[eventName] = (callbacks[eventName] || []).concat(cb)

        return () => removeEventListener(eventName, cb)
    }

    return router
}
