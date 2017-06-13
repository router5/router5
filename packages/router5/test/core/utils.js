import { expect } from 'chai';
import createTestRouter from '../_create-router';
import { omitMeta } from '../_helpers';

describe('core/utils', () => {
    let router;

    context('with strictQueryParams', () => {
        before(() => (router = createTestRouter().clone().start()));
        after(() => router.stop());

        it('should expose RouteNode path building function', function() {
            expect(router.buildPath('users.list')).to.equal('/users/list');
        });

        it('should tell if a route is active or not', function() {
            router.navigate('users.view', { id: 1 });
            expect(router.isActive('users.view', { id: 1 })).to.equal(true);
            expect(router.isActive('users.view', { id: 2 })).to.equal(false);
            expect(router.isActive('users.view')).to.equal(false);
            expect(router.isActive('users')).to.equal(true);
            expect(router.isActive('users', {}, true)).to.equal(false);

            router.navigate('section.query', { section: 'section1' });
            expect(
                router.isActive('section', { section: 'section1' })
            ).to.equal(true);
            expect(
                router.isActive('section.query', {
                    section: 'section1',
                    param1: '123'
                })
            ).to.equal(true);
            expect(
                router.isActive('section.query', { section: 'section2' })
            ).to.equal(false);
            expect(
                router.isActive(
                    'section.query',
                    { section: 'section1', param2: '123' },
                    false,
                    false
                )
            ).to.equal(false);
            expect(router.isActive('users.view', { id: 123 })).to.equal(false);
        });

        it('should match deep `/` routes', function() {
            router.setOption('useTrailingSlash', false);
            expect(omitMeta(router.matchPath('/profile'))).to.eql({
                name: 'profile.me',
                params: {},
                path: '/profile'
            });

            router.setOption('useTrailingSlash', true);
            expect(omitMeta(router.matchPath('/profile'))).to.eql({
                name: 'profile.me',
                params: {},
                path: '/profile/'
            });
        });
    });

    context('without strictQueryParams', () => {
        before(
            () =>
                (router = createTestRouter({ strictQueryParams: false })
                    .clone()
                    .start())
        );
        after(() => router.stop());

        it('should build paths with extra parameters', () => {
            expect(
                router.buildPath('users.view', {
                    id: '123',
                    username: 'thomas'
                })
            ).to.equal('/users/view/123?username=thomas');
        });
    });
});
