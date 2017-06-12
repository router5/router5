import element from 'virtual-element';

const Link = {
    propTypes: {
        name:       { type: 'string' },
        params:     { type: 'object' },
        options:    { type: 'object' },
        navigateTo: { type: 'function' }
    },

    defaultProps: {
        params:          {},
        options:         {}
    },

    render({ props }) {
        const { name, params, options, router, navigateTo } = props;

        const href = router.buildUrl(name);
        const onClick = (evt) => {
            evt.preventDefault();
            navigateTo(name, params, options);
        };
        const className = router.isActive(name, params) ? 'active' : '';

        return element('a', { href, onClick, 'class': className }, props.children);
    }
};

export default Link;
