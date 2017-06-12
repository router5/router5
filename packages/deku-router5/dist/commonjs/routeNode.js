'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function routeNode(nodeName) {
    return function routeNodeWrapper(RouteSegment) {
        var RouteNode = {
            propTypes: {
                router: { source: 'router' }
            },

            afterMount: function afterMount(_ref, elm, setState) {
                var props = _ref.props;

                props.router.addNodeListener(nodeName, function (toState, fromState) {
                    setState({ route: toState, previousRoute: fromState });
                });
            },
            render: function render(_ref2) {
                var props = _ref2.props,
                    state = _ref2.state;
                var route = state.route,
                    previousRoute = state.previousRoute;


                if (route === undefined) {
                    route = props.router.getState();
                    previousRoute = null;
                }

                return { type: RouteSegment, children: [], attributes: _extends({}, props, { route: route, previousRoute: previousRoute }) };
            }
        };

        return RouteNode;
    };
}

exports.default = routeNode;