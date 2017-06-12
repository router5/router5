(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.router5Helpers = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.redirect = redirect;
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
            };

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
        } else {
            throw new Error('[router5][helpers][redirect] no arguments supplied.');
        }
    }

    var startsWithSegment = exports.startsWithSegment = testRouteWithSegment('^', dotOrEnd);
    var endsWithSegment = exports.endsWithSegment = testRouteWithSegment(dotOrStart, '$');
    var includesSegment = exports.includesSegment = testRouteWithSegment(dotOrStart, dotOrEnd);
});