import { expect } from 'chai'
import { spy } from 'sinon'
import createRouter from '../../modules'

const canActivate = () => () => true
const routes = [
    {
        name: 'a',
        path: '/path',
        canActivate,
        children: [
            {
                name: 'b',
                path: '/path',
                canActivate,
                children: [
                    {
                        name: 'c',
                        path: '/path',
                        canActivate
                    }
                ]
            }
        ]
    }
]

describe('createRouter', function() {
    let router

    before(() => {
        router = createRouter()
        spy(router, 'canActivate')
    })

    // it('should not start with default route if current path matches an existing route', function (done) {
    //     router.start(function (err, state) {
    //         expect(router.getState()).to.eql({name: 'orders.pending', params: {}, path: '/orders/pending'});
    //         done();
    //     });
    // });

    it('should create a router and register canActivate handlers', function() {
        router.add(routes)

        expect(router.canActivate).to.have.been.calledThrice

        expect(router.canActivate).to.have.been.calledWith('a', canActivate)
        expect(router.canActivate).to.have.been.calledWith('a.b', canActivate)
        expect(router.canActivate).to.have.been.calledWith('a.b.c', canActivate)

        expect(router.canActivate).to.not.have.been.calledWith('b', canActivate)
        expect(router.canActivate).to.not.have.been.calledWith('c', canActivate)
    })
})
