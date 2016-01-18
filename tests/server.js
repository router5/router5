import { expect } from 'chai';
import path from 'path';
import createRouter from './_create-router';

const base = '';
const useHash = false;
const router = createRouter(base, useHash);

const omitMeta = (obj) => ({
    name: obj.name,
    params: obj.params,
    path: obj.path
});

describe('router5', function () {
    it('should start with the default route', function (done) {
        const router = createRouter(base, useHash);
        router.start(function (err, state) {
            expect(omitMeta(state)).to.eql({name: 'home', params: {}, path: '/home'});
            done();
        });
    });

    it('should start with the provided path', function (done) {
        const router = createRouter(base, useHash);
        router.start('/users', function (err, state) {
            expect(omitMeta(state)).to.eql({name: 'users', params: {}, path: '/users'});
            done();
        });
    });

    it('should start with the default path if the provided path is not allowed', function (done) {
        const router = createRouter(base, useHash);
        router.start('/admin', function (err, state) {
            expect(omitMeta(state)).to.eql({name: 'home', params: {}, path: '/home'});
            done();
        });
    });
});
