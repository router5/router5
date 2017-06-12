'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Link = {
    propTypes: {
        router: { source: 'router' },
        route: { source: 'route' },
        button: { type: 'boolean' },
        routeName: { type: 'string', optional: false },
        routeParams: { type: 'object' },
        routeOptions: { type: 'object' },
        activeClass: { type: 'string' },
        activeStrict: { type: 'function' },
        onClick: { type: 'function' }
    },

    defaultProps: {
        activeClass: 'active',
        button: false,
        activeStrict: false,
        routeParams: {},
        routeOptions: {}
    },

    render: function render(_ref) {
        var props = _ref.props;
        var button = props.button,
            activeClass = props.activeClass,
            routeName = props.routeName,
            routeParams = props.routeParams,
            routeOptions = props.routeOptions,
            children = props.children,
            router = props.router;


        var clickHandler = function clickHandler(evt) {
            evt.preventDefault();
            router.navigate(routeName, routeParams, routeOptions);
        };

        var active = router.isActive(routeName, routeParams);
        var href = router.buildUrl(routeName, routeParams);

        var className = (props.class ? props.class.split(' ') : []).concat(active ? [activeClass] : []).join(' ');

        var onClick = props.onClick || clickHandler;

        if (button) {
            return element('button', { type: 'button', 'class': className, onClick: onClick }, children);
        }

        return { type: 'a', children: children, attributes: { href: href, 'class': className, onClick: onClick } };
    }
};

exports.default = Link;