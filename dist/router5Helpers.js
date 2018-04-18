(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.router5Helpers = {})));
}(this, (function (exports) { 'use strict';

    var dotOrEnd = '(\\..+$|$)';
    var dotOrStart = '(^.+\\.|^)';

    function getName(route) {
        return typeof route === 'string' ? route : route.name || '';
    }

    function test(route, regex) {
        return regex.test(getName(route));
    }

    function normaliseSegment(name) {
        return name.replace('.', '\\.');
    }

    function testRouteWithSegment(before, after) {
        return function () {
            var route = arguments[0];

            function applySegment(segment) {
                return test(route, new RegExp(before + normaliseSegment(segment) + after));
            }

            if (arguments.length === 2) {
                return applySegment(arguments[1]);
            }

            return applySegment;
        };
    }

    function redirect() {
        var fromRouteName = arguments[0];

        var redirectTo = function redirectTo(routeName, routeParams) {
            return function () {
                return function (toState, fromState, done) {
                    if (toState.name === fromRouteName) {
                        var finalRouteParams = typeof routeParams === 'function' ? routeParams(fromState.params) : routeParams;

                        var redirectState = finalRouteParams === undefined ? { name: routeName } : { name: routeName, params: finalRouteParams };

                        done({ redirect: redirectState });
                    } else {
                        done(null);
                    }
                };
            };
        };

        if (arguments.length > 1) {
            return redirectTo(arguments[1], arguments[2]);
        } else if (arguments.length === 1) {
            return redirectTo;
        }

        throw new Error('[router5][helpers][redirect] no arguments supplied.');
    }

    var startsWithSegment = testRouteWithSegment('^', dotOrEnd);
    var endsWithSegment = testRouteWithSegment(dotOrStart, '$');
    var includesSegment = testRouteWithSegment(dotOrStart, dotOrEnd);

    exports.redirect = redirect;
    exports.startsWithSegment = startsWithSegment;
    exports.endsWithSegment = endsWithSegment;
    exports.includesSegment = includesSegment;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
