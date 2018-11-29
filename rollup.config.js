const typescript = require('rollup-plugin-typescript2')
const {uglify} = require('rollup-plugin-uglify')
const nodeResolve = require('rollup-plugin-node-resolve')
const common = require('rollup-plugin-commonjs')

const formatSuffix = {
    es: '.es',
    cjs: ''
}

const makeConfig = ({ packageName, declaration = false, format, external, compress = false, file }) => {
    const outputFile = file || `packages/${packageName}/dist/index${formatSuffix[format]}.js`
    const plugins = [
        nodeResolve({ jsnext: true, module: true }),
        common({ include: `packages/${packageName}/node_modules/**` }),
        typescript({
            tsconfig: `./packages/${packageName}/tsconfig.build.json`,
            useTsconfigDeclarationDir: true,
            clean: true,
            tsconfigOverride: { compilerOptions: { declaration } }
        }),
        compress && uglify()
    ].filter(Boolean)

    return {
        input: `packages/${packageName}/modules/index.ts`,
        output: {
            file: outputFile,
            name: packageName,
            format
        },
        external,
        plugins
    }
}

const router5Dependencies = Object.keys(require('./packages/router5/package.json').dependencies)

const config = [
    makeConfig({
        packageName: 'router5',
        file: 'dist/router5.min.js',
        format: 'umd',
        compress: true
    }),
    makeConfig({
        packageName: 'router5',
        file: 'dist/router5.js',
        format: 'umd'
    }),
    makeConfig({
        packageName: 'router5',
        declaration: true,
        format: 'cjs',
        external: router5Dependencies
    }),
    makeConfig({
        packageName: 'router5',
        format: 'es',
        external: router5Dependencies
    }),
    makeConfig({
        packageName: 'router5-Helpers',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'router5-Helpers',
        format: 'es'
    })
]

export default config
