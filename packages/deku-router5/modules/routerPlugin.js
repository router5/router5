const routerPlugin = router => app => {
    app.set('router', router);
    app.set('route', router.getState());
    router.addListener(toState => app.set('route', toState));
};

export default routerPlugin;
