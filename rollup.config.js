const typescript = require('rollup-plugin-typescript2')
const { uglify } = require('rollup-plugin-uglify')
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')

const makeConfig = ({
    packageName,
    declaration = false,
    umd = false,
    compress = false,
    file
}) => {
    const plugins = [
        nodeResolve({ mainFields: ['jsnext', 'module']}),
        commonjs(),
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
        external:
            umd ? [] : Object.keys(
                      require(`./packages/${packageName}/package.json`)
                          .dependencies || {}
                  ).concat(
                      Object.keys(
                          require(`./packages/${packageName}/package.json`)
                              .peerDependencies || {}
                      )
                  ),
        output: umd ? {
            file,
            name: packageName,
            format: 'umd'
        } : [
            {
                format: 'es',
                file: `packages/${packageName}/dist/index.es.js`
            },
            {
                format: 'cjs',
                file: `packages/${packageName}/dist/index.js`
            }
        ],
        plugins
    }
}

const makePackageConfig = packageName =>
    makeConfig({
        packageName,
        declaration: true
    })

module.exports = [
    makeConfig({
        packageName: 'router5',
        file: 'dist/router5.min.js',
        umd: true,
        compress: true
    }),
    makeConfig({
        packageName: 'router5',
        file: 'dist/router5.js',
        umd: true,
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
