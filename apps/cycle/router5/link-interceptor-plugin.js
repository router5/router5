import onClick from './link-on-click';

const linkInterceptorPlugin = () => (router) => {
    const listener = onClick(router);

    return {
        name: 'LINK_INTERCEPTOR',
        onStart: () => {
            document.addEventListener('click', listener, false);
        },
        onStop: () => {
            document.removeEventListener('click', listener);
        }
    }
};

export default linkInterceptorPlugin;
