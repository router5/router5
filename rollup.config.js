const typescript = require('rollup-plugin-typescript2')
const { uglify } = require('rollup-plugin-uglify')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

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
        commonjs({
            include: `packages/${packageName}/node_modules/**`,
            namedExports: {
                [`packages/${packageName}/node_modules/immutable/dist/immutable.js`]: [
                    'Record',
                    'Map'
                ]
            }
        }),
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
                  ).concat(
                      Object.keys(
                          require(`./packages/${packageName}/package.json`)
                              .peerDependencies || {}
                      )
                  )
                : [],
        plugins
    }
}

const format = process.env.FORMAT
const declaration = format === 'cjs'
const makePackageConfig = packageName =>
    makeConfig({
        packageName,
        declaration,
        format
    })

module.exports = [
    format === 'cjs' &&
        makeConfig({
            packageName: 'router5',
            file: 'dist/router5.min.js',
            format: 'umd',
            compress: true
        }),
    format === 'cjs' &&
        makeConfig({
            packageName: 'router5',
            file: 'dist/router5.js',
            format: 'umd'
        }),
    makePackageConfig('router5'),
    makePackageConfig('router5-helpers'),
    makePackageConfig('router5-transition-path'),
    makePackageConfig('router5-plugin-browser'),
    makePackageConfig('router5-plugin-logger'),
    makePackageConfig('router5-plugin-listeners'),
    makePackageConfig('router5-plugin-persistent-params'),
    makePackageConfig('rxjs-router5'),
    makePackageConfig('xstream-router5'),
    makePackageConfig('react-router5'),
    makePackageConfig('react-router5-hocs'),
    makePackageConfig('redux-router5'),
    makePackageConfig('redux-router5-immutable')
].filter(Boolean)
