#!/usr/bin/env node

import mkdirp from 'mkdirp';
import del from 'del';
import promisify from 'promisify-node';

const makeDir = promisify(mkdirp);

async function clean() {
    await del('dist');
    await del('coverage');
    await del('core');
    await del('plugins');
    await del('transition');
    await del('utils');
    await del('constants.js');
    await del('create-router.js');
    await del('index.js');
    await makeDir('dist');
}

clean();
