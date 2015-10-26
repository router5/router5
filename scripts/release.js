#!/usr/bin/env node

var exec = require('child_process').execSync;
var argv = require('yargs').argv;
var fs   = require('fs');
var path = require('path');

var versionType = argv.major ? 'major' : (argv.minor ? 'minor' : 'patch');

run('npm install');
run('npm prune');
var VERSION = run('npm --no-git-tag-version version ' + versionType, false);

run('npm run lint');
run('npm run build');
run('npm test');
run('npm run clog');

run('git add -A');
run('git add dist -f');
run('git commit -m "chore: ' + VERSION + '"');
run('git tag ' + VERSION);
run('git push origin master');
run('git push --tags');

run('npm publish');

function run(cmd, log) {
    log = log === undefined ? true : log;
    var res = exec(cmd).toString();
    if (log && res) console.log(res);
    return res;
}
