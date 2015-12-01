var path = require('path');
var createRouter = require('./_create-router');

var should    = require('should');
require('mocha');

var base = '';
var useHash = false;
var router = createRouter(base, useHash);

function omitMeta(obj) {
    return {
        name: obj.name,
        params: obj.params,
        path: obj.path
    };
}

describe('router5', function () {
    it('should start with the default route', function (done) {
        var router = createRouter(base, useHash);
        router.start(function (err, state) {
            omitMeta(state).should.eql({name: 'home', params: {}, path: '/home'});
            done();
        });
    });

    it('should start with the provided path', function (done) {
        var router = createRouter(base, useHash);
        router.start('/users', function (err, state) {
            omitMeta(state).should.eql({name: 'users', params: {}, path: '/users'});
            done();
        });
    });

    it('should start with the default path if the provided path is not allowed', function (done) {
        var router = createRouter(base, useHash);
        router.start('/admin', function (err, state) {
            omitMeta(state).should.eql({name: 'home', params: {}, path: '/home'});
            done();
        });
    });
});
