import React from 'react'

export default router5LinkFactory

let router5LinkFactory = (router) => {
    return React.createClass({
        propTypes: {
            routeName:    React.PropTypes.string.isRequired
            routeParams:  React.PropTypes.object
            routeOptions: React.PropTypes.object
        },

        shouldComponentUpdate(nextProps, nextState) {
            return !router.areStatesEqual(
                {name: nextProps.routeName,  params: nextProps.routeParams},
                {name: this.props.routeName, params: this.props.routeParams}
            )
        },

        clickHandler(evt) {
            evt.preventDefault()
            router.navigate(this.props.routeName, this.props.routeParams, this.props.options)
        },

        render() {
            let path = router.buildPath(this.props.routeName, this.props.routeParams)
            return <a href={path} onClick={clickHandler}></a>
        }
    })
}
