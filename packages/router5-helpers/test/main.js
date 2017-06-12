import { expect } from 'chai';
import * as helpers from '../modules/router5Helpers';

describe('router5.helpers', function () {
    describe('.startsWithSegment()', function () {
        it('should return true if a route starts with a segment', function () {
            expect(helpers.startsWithSegment('a.b.c', 'a')).to.be.true;
            expect(helpers.startsWithSegment('a.b.c', 'a.b')).to.be.true;
            expect(helpers.startsWithSegment({ name: 'a.b.c' }, 'a')).to.be.true;
        });

        it('should return false if a route does not start with a segment', function () {
            expect(helpers.startsWithSegment('a.b.c', 'aa')).to.be.false;
            expect(helpers.startsWithSegment('a.b.c', 'a.a')).to.be.false;
            expect(helpers.startsWithSegment({ name: 'a.b.c' }, 'aa')).to.be.false;
        });
    });

    describe('.endsWithSegment()', function () {
        it('should return true if a route ends with a segment', function () {
            expect(helpers.endsWithSegment('a.b.c', 'c')).to.be.true;
            expect(helpers.endsWithSegment({ name: 'a.b.c' }, 'c')).to.be.true;
        });

        it('should return false if a route does not end with a segment', function () {
            expect(helpers.endsWithSegment('a.b.c', 'cc')).to.be.false;
            expect(helpers.endsWithSegment({ name: 'a.b.c' }, 'cc')).to.be.false;
        });
    });

    describe('.includesSegment()', function () {
        it('should return true if a route includes a segment', function () {
            expect(helpers.includesSegment('a.b.c', 'a')).to.be.true;
            expect(helpers.includesSegment('a.b.c', 'a.b')).to.be.true;
            expect(helpers.includesSegment('a.b.c', 'a.b.c')).to.be.true;
            expect(helpers.includesSegment('a.b.c', 'b')).to.be.true;
            expect(helpers.includesSegment('a.b.c', 'c')).to.be.true;
        });

        it('should return false if a route does not include a segment', function () {
            expect(helpers.includesSegment('a.b.c', 'aa')).to.be.false;
            expect(helpers.includesSegment('a.bb.c', 'a.b')).to.be.false;
            expect(helpers.includesSegment('a.b.c', 'bb.c')).to.be.false;
            expect(helpers.includesSegment('a.b.c', 'a.b.b')).to.be.false;
        });
    });

    describe('.redirect()', function () {
        it('should return a "redirect" error if node is matched', function () {
            helpers.redirect('a', 'b')()({ name: 'a' }, null, function done(err) {
                expect(err).to.eql({
                    redirect: { name: 'b' }
                });
            });
        });

        it('should not return a "redirect" error if node is not matched', function () {
            helpers.redirect('a', 'b')()({ name: 'b' }, null, function done(err) {
                expect(err).to.not.exist;
            });
        });
    });
});
