import { Component, PropTypes, Children } from 'react';

var RouterProvider = function (_Component) {
    babelHelpers.inherits(RouterProvider, _Component);

    function RouterProvider(props, context) {
        babelHelpers.classCallCheck(this, RouterProvider);

        var _this = babelHelpers.possibleConstructorReturn(this, (RouterProvider.__proto__ || Object.getPrototypeOf(RouterProvider)).call(this, props, context));

        _this.router = props.router;
        return _this;
    }

    babelHelpers.createClass(RouterProvider, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return { router: this.router };
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.router !== nextProps.router) {
                console.error('[react-router5][Router]does not support changing the router object.');
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var children = this.props.children;

            return Children.only(children);
        }
    }]);
    return RouterProvider;
}(Component);

RouterProvider.propTypes = {
    router: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
};

RouterProvider.childContextTypes = {
    router: PropTypes.object.isRequired
};

export default RouterProvider;