import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify'
import nodeResolve from 'rollup-plugin-node-resolve'
import common from 'rollup-plugin-commonjs'

const modules = {
    router5: 'packages/router5/modulests/index.ts'
}

const makeConfig = ({ moduleName, declaration = false, format, external, compress = false, file }) => {
    const packageDir = modules[moduleName].match(/^packages\/([\w-]+)\//)[1]
    const plugins = [
        nodeResolve({ jsnext: true, module: true }),
        common({ include: `packages/${packageDir}/node_modules/**` }),
        typescript({
            tsconfig: `./packages/router5/tsconfig.build.json`,
            useTsconfigDeclarationDir: true,
            clean: true,
            tsconfigOverride: { compilerOptions: { declaration } }
        }),
        compress && uglify()
    ].filter(Boolean)

    return {
        input: modules[moduleName],
        output: {
            file,
            name: moduleName,
            format
        },
        external,
        plugins
    }
}

const router5Package = require('./packages/router5/package.json')

const config = [
    makeConfig({
        moduleName: 'router5',
        declaration: true,
        file: 'dist/router5.min.js',
        format: 'umd',
        compress: true
    }),
    makeConfig({
        moduleName: 'router5',
        file: 'dist/router5.js',
        format: 'umd'
    }),
    makeConfig({
        moduleName: 'router5',
        file: 'packages/router5/dist/index.js',
        format: 'cjs',
        external: Object.keys(router5Package.dependencies)
    }),
    makeConfig({
        moduleName: 'router5',
        file: 'packages/router5/dist/index.es.js',
        format: 'es',
        external: Object.keys(router5Package.dependencies)
    }),

]

export default config
