#!/usr/bin/env node

const { execSync } = require('child_process');

const packages = [
    'router5',
    'router5-helpers',
    'router5-transition-path',
    'react-router5',
    'redux-router5',
    'xstream-router5',
    'rxjs-router5',
    'deku-router5'
];

packages.forEach(pkg => {
    execSync(
        `BABEL_ENV=development ./node_modules/.bin/babel packages/${pkg}/modules --out-dir packages/${pkg}/dist/commonjs`
    );

    console.log('✓ CommonJS');

    execSync(
        `BABEL_ENV=es ./node_modules/.bin/babel packages/${pkg}/modules --out-dir packages/${pkg}/dist/es`
    );

    console.log('✓ ES');
});
