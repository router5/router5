/**
 * @license
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 router5
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function () {
'use strict';

function linkFactory(router) {
    return React.createClass({
        propTypes: {
            routeName: React.PropTypes.string.isRequired,
            routeParams: React.PropTypes.object,
            routeOptions: React.PropTypes.object,
            activeClassName: React.PropTypes.string,
            activeStrict: React.PropTypes.bool,
            onClick: React.PropTypes.func
        },

        getDefaultProps: function getDefaultProps() {
            return {
                activeClassName: 'active',
                activeStrict: false,
                routeParams: {},
                routeOptions: {}
            };
        },

        getInitialState: function getInitialState() {
            // Initialise state
            // Not an anti-pattern
            // https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
            return {
                active: router.isActive(this.props.routeName, this.props.routeParams, this.props.activeStrict)
            };
        },

        // Is it overkill?
        shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
            return !router.areStatesEqual({ name: nextProps.routeName, params: nextProps.routeParams }, { name: this.props.routeName, params: this.props.routeParams }) || this.state.active !== nextState.active;
        },

        clickHandler: function clickHandler(evt) {
            evt.preventDefault();
            router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
        },

        // Is it overkill?
        // Should it be an option to observe state in Links?
        // Should we add a GroupLink component for menus?
        routeChangeHandler: function routeChangeHandler(toState, fromState) {
            this.setState({ active: router.isActive(this.props.routeName, this.props.routeParams) });
        },

        componentDidMount: function componentDidMount() {
            router.addListener(this.routeChangeHandler);
        },

        componentWillUnmount: function componentWillUnmount() {
            router.removeListener(this.routeChangeHandler);
        },

        render: function render() {
            var props = this.props;
            var active = this.state.active;

            var href = router.buildUrl(props.routeName, props.routeParams);
            var className = (props.className ? props.className.split(' ') : []).concat(active ? [props.activeClassName] : []).join(' ');
            var onClick = props.onClick || this.clickHandler;

            return React.createElement('a', { href: href, className: className, onClick: onClick }, props.children);
        }
    });
}
function segmentMixinFactory(router) {
    return function (routeName, listener) {
        return {
            nodeListener: function nodeListener(toState, fromState) {
                listener.call(this, toState, fromState);
            },

            componentDidMount: function componentDidMount() {
                router.addNodeListener(routeName, this.nodeListener);
                router.registerComponent(routeName, this);
            },

            componentWillUnmount: function componentWillUnmount() {
                router.removeNodeListener(routeName, this.nodeListener);
                router.deregisterComponent(routeName, this);
            }
        };
    };
}

window.linkFactory = linkFactory;
window.segmentMixinFactory = segmentMixinFactory;

}());
