import transitionPath, { shouldUpdateNode } from '../modules'
import { expect } from 'chai'
import tt from 'typescript-definition-tester'

describe('router5-transition-path', function() {
    it('should return a transition path with from null state', function() {
        expect(
            transitionPath({ name: 'a.b.c', params: {}, meta: {} }, null)
        ).to.eql({
            intersection: '',
            toActivate: ['a', 'a.b', 'a.b.c'],
            toDeactivate: []
        })
    })

    it('should return transition path between two states', function() {
        const meta = {
            params: {
                a: {},
                'a.b': {},
                'a.b.c': {},
                'a.b.c.d': {}
            }
        }

        expect(
            transitionPath(
                { name: 'a.b.c.d', params: {}, meta },
                { name: 'a.b.e.f', params: {}, meta }
            )
        ).to.eql({
            intersection: 'a.b',
            toActivate: ['a.b.c', 'a.b.c.d'],
            toDeactivate: ['a.b.e.f', 'a.b.e']
        })
    })

    it('should return transition path two states with same name but different params', function() {
        const meta = {
            params: {
                a: {},
                'a.b': { p1: 'url' },
                'a.b.c': { p2: 'url' },
                'a.b.c.d': { p3: 'url' }
            }
        }

        expect(
            transitionPath(
                { name: 'a.b.c.d', params: { p1: 0, p2: 2, p3: 3 }, meta },
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 3 }, meta }
            ).intersection
        ).to.equal('a')

        expect(
            transitionPath(
                { name: 'a.b.c.d', params: { p1: 1, p2: 0, p3: 3 }, meta },
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 3 }, meta }
            ).intersection
        ).to.equal('a.b')

        expect(
            transitionPath(
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 0 }, meta },
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 3 }, meta }
            ).intersection
        ).to.equal('a.b.c')
    })

    describe('shouldUpdateNode', () => {
        const meta = {
            params: {
                a: {},
                'a.b': { p1: 'url' },
                'a.b.c': { p2: 'url' },
                'a.b.c.d': { p3: 'url' },
                'a.b.c.e': { p4: 'url' }
            }
        }

        it('should tell intersection node to update', () => {
            const shouldUpdate = shouldUpdateNode('a')(
                { name: 'a.b.c.d', params: { p1: 0, p2: 2, p3: 3 }, meta },
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 3 }, meta }
            )

            expect(shouldUpdate).to.equal(true)
        })

        it('should tell node above intersection to not update', () => {
            const shouldUpdate = shouldUpdateNode('')(
                { name: 'a.b.c.d', params: { p1: 0, p2: 2, p3: 3 }, meta },
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 3 }, meta }
            )

            expect(shouldUpdate).to.equal(false)
        })

        it('should tell node below intersection to update if not deactivated', () => {
            const fromState = {
                name: 'a.b.c.d',
                params: { p1: 0, p2: 2, p3: 3 },
                meta
            }
            const toState = {
                name: 'a.b.c.e',
                params: { p1: 1, p2: 2, p4: 3 },
                meta
            }

            expect(shouldUpdateNode('a.b')(toState, fromState)).to.equal(true)
            expect(shouldUpdateNode('a.b.c')(toState, fromState)).to.equal(true)
            expect(shouldUpdateNode('a.b.c.e')(toState, fromState)).to.equal(
                false
            )
        })
    })

    describe('TypeScript definitions', function() {
        it('should compile examples against index.d.ts', function(done) {
            this.timeout(10000)

            tt.compileDirectory(
                `${__dirname}/typescript`,
                filename => filename.match(/\.ts$/),
                { lib: ['lib.es2015.d.ts'] },
                () => done()
            )
        })
    })
})
