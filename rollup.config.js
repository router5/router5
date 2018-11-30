const typescript = require('rollup-plugin-typescript2')
const { uglify } = require('rollup-plugin-uglify')
const nodeResolve = require('rollup-plugin-node-resolve')
const common = require('rollup-plugin-commonjs')

const formatSuffix = {
    es: '.es',
    cjs: ''
}

const makeConfig = ({
    packageName,
    declaration = false,
    format,
    compress = false,
    file
}) => {
    const outputFile =
        file || `packages/${packageName}/dist/index${formatSuffix[format]}.js`
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
        external:
            format === 'es' || format === 'cjs'
                ? Object.keys(
                      require(`./packages/${packageName}/package.json`)
                          .dependencies || {}
                  )
                : [],
        plugins
    }
}

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
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'router5',
        format: 'es'
    }),
    makeConfig({
        packageName: 'router5-helpers',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'router5-helpers',
        format: 'es'
    }),
    makeConfig({
        packageName: 'router5-transition-path',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'router5-transition-path',
        format: 'es'
    }),
    makeConfig({
        packageName: 'router5-plugin-browser',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'router5-plugin-browser',
        format: 'es'
    }),
    makeConfig({
        packageName: 'router5-plugin-logger',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'router5-plugin-logger',
        format: 'es'
    }),
    makeConfig({
        packageName: 'router5-plugin-listeners',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'router5-plugin-listeners',
        format: 'es'
    }),
    makeConfig({
        packageName: 'router5-plugin-persistent-params',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'router5-plugin-persistent-params',
        format: 'es'
    }),
    makeConfig({
        packageName: 'rxjs-router5',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'rxjs-router5',
        format: 'es'
    }),
    makeConfig({
        packageName: 'xstream-router5',
        declaration: true,
        format: 'cjs'
    }),
    makeConfig({
        packageName: 'xstream-router5',
        format: 'es'
    })
]

export default config
