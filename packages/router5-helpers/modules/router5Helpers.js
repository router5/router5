const dotOrEnd = '(\\..+$|$)';
const dotOrStart = '(^.+\\.|^)';

function getName(route) {
    return typeof route === 'string' ? route : (route.name || '');
}

function test(route, regex) {
    return regex.test(getName(route));
}

function normaliseSegment(name) {
    return name.replace('.', '\\.');
}

function testRouteWithSegment(before, after) {
    return function () {
        const route = arguments[0];

        function applySegment(segment) {
            return test(route, new RegExp(before + normaliseSegment(segment) + after));
        };

        if (arguments.length === 2) {
            return applySegment(arguments[1]);
        }

        return applySegment;
    };
}

export function redirect() {
    const fromRouteName = arguments[0];

    const redirectTo = (routeName, routeParams) => () => (toState, fromState, done) => {
        if (toState.name === fromRouteName) {
            const finalRouteParams = typeof routeParams === 'function'
                ? routeParams(fromState.params)
                : routeParams;

            const redirectState = finalRouteParams === undefined
                ? { name: routeName }
                : { name: routeName, params: finalRouteParams };

            done({ redirect: redirectState });
        } else {
            done(null);
        }
    };

    if (arguments.length > 1) {
        return redirectTo(arguments[1], arguments[2])
    } else if (arguments.length === 1) {
        return redirectTo;
    } else {
        throw new Error('[router5][helpers][redirect] no arguments supplied.');
    }
}

export const startsWithSegment = testRouteWithSegment('^', dotOrEnd);
export const endsWithSegment = testRouteWithSegment(dotOrStart, '$');
export const includesSegment = testRouteWithSegment(dotOrStart, dotOrEnd);
