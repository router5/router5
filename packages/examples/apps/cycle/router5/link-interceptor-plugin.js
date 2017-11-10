import { shouldInterceptEvent, onClick } from './link-on-click'

const linkInterceptorPlugin = () => router => {
    const listener = evt => {
        if (shouldInterceptEvent(router)(evt)) {
            onClick(router)(evt)
        }
    }

    return {
        name: 'LINK_INTERCEPTOR',
        onStart: () => {
            document.addEventListener('click', listener, false)
        },
        onStop: () => {
            document.removeEventListener('click', listener)
        }
    }
}

export default linkInterceptorPlugin
