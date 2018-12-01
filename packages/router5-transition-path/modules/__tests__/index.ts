import transitionPath, { shouldUpdateNode } from '../'

describe('router5-transition-path', () => {
    it('should return a transition path with from null state', () => {
        expect(
            transitionPath({ name: 'a.b.c', params: {}, meta: {} }, null)
        ).toEqual({
            intersection: '',
            toActivate: ['a', 'a.b', 'a.b.c'],
            toDeactivate: []
        })
    })

    it('should return transition path between two states', () => {
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
        ).toEqual({
            intersection: 'a.b',
            toActivate: ['a.b.c', 'a.b.c.d'],
            toDeactivate: ['a.b.e.f', 'a.b.e']
        })
    })

    it('should return transition path two states with same name but different params', () => {
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
        ).toBe('a')

        expect(
            transitionPath(
                { name: 'a.b.c.d', params: { p1: 1, p2: 0, p3: 3 }, meta },
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 3 }, meta }
            ).intersection
        ).toBe('a.b')

        expect(
            transitionPath(
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 0 }, meta },
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 3 }, meta }
            ).intersection
        ).toBe('a.b.c')
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

            expect(shouldUpdate).toBe(true)
        })

        it('should tell node above intersection to not update', () => {
            const shouldUpdate = shouldUpdateNode('')(
                { name: 'a.b.c.d', params: { p1: 0, p2: 2, p3: 3 }, meta },
                { name: 'a.b.c.d', params: { p1: 1, p2: 2, p3: 3 }, meta }
            )

            expect(shouldUpdate).toBe(false)
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

            expect(shouldUpdateNode('a.b')(toState, fromState)).toBe(true)
            expect(shouldUpdateNode('a.b.c')(toState, fromState)).toBe(true)
            expect(shouldUpdateNode('a.b.c.e')(toState, fromState)).toBe(false)
        })
    })

    it('should take into action transition options', () => {
        expect(
            transitionPath(
                {
                    name: 'a.b.c.d',
                    params: {},
                    meta: { options: { reload: true } }
                },
                {
                    name: 'a.b.c',
                    params: {},
                    meta: {}
                }
            )
        ).toEqual({
            intersection: '',
            toActivate: ['a', 'a.b', 'a.b.c', 'a.b.c.d'],
            toDeactivate: ['a.b.c', 'a.b', 'a']
        })
    })
})
