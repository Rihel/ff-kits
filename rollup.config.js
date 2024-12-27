import _ from 'lodash'
import autoprefixer from 'autoprefixer'
import changeCase from 'change-case'
import commonjs from '@rollup/plugin-commonjs'
import fs from 'fs'
import image from '@rollup/plugin-image'
import jetpack from 'fs-jetpack'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import postcss from 'rollup-plugin-postcss'
import postcssUrl from 'postcss-url'
import tailwindcss from 'tailwindcss'
import typescript from '@rollup/plugin-typescript'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const packagesRoot = path.resolve(__dirname, './packages')
const packageDirectroies = fs
  .readdirSync(packagesRoot)
  .map((item) => {
    return path.resolve(packagesRoot, item)
  })
  .filter((item) => {
    return fs.statSync(item).isDirectory()
  })

const libs = [
  { varname: 'React', pkg: 'react' },
  { varname: 'ReactJsxRuntime', pkg: 'react/jsx-runtime' },
  { varname: 'ReactDom', pkg: 'react-dom' },
  { varname: 'ReactRouterDom', pkg: 'react-router-dom' },
  { varname: 'ClassValidator', pkg: 'class-validator' },
  { varname: 'ClassTransformer', pkg: 'class-transformer' },
  { varname: 'ahooks', pkg: 'ahooks' },
  { varname: 'immer', pkg: 'immer' },
  { varname: 'useImmer', pkg: 'use-immer' },
  { varname: 'twMerge', pkg: 'tailwind-merge' },
  { varname: 'cva', pkg: 'class-variance-authority' },
  { varname: 'hox', pkg: 'hox' },
  { varname: 'antd', pkg: 'antd' },
  { varname: 'antIcons', pkg: '@ant-design/icons' },
  { varname: 'classNames', pkg: 'classnames' },
  { varname: '_', pkg: 'lodash' },
  { varname: 'dayjs', pkg: 'dayjs' },
  { varname: 'axios', pkg: 'axios' },
  { varname: 'Qs', pkg: 'qs' },
  { varname: 'Sortable', pkg: 'sortablejs' },
  { varname: 'Cookies', pkg: 'js-cookie' },
  { varname: 'nanoid', pkg: 'nanoid' },
  { varname: 'md5', pkg: 'js-md5' },
  { varname: 'Awilix', pkg: 'awilix' },
  { varname: 'mitt', pkg: 'mitt' },
  { varname: 'tmpl', pkg: 'riot-tmpl' },
  { varname: 'idb', pkg: 'idb' },
  { varname: 'pako', pkg: 'pako' },
  { varname: 'Remix', pkg: '@remixicon/react' },
  { varname: 'AwsSdkClientS3', pkg: '@aws-sdk/client-s3' },
  { varname: 'AwsSdkS3RequestPresigner', pkg: '@aws-sdk/s3-request-presigner' },
]

function buildPkgsInfo() {
  const pkgs = packageDirectroies.map((item) => {
    const pkgJson = jetpack.read(path.resolve(item, 'package.json'), 'json')
    const dirname = _.chain(item).split('/').filter(Boolean).last().value()
    const name = pkgJson.name
    const varname = changeCase.pascalCase(name.replace('@ff-kits/', 'ff-kits-'))
    const deps = _.chain(pkgJson.dependencies)
      .pickBy((value, key) => key.startsWith('@ff'))
      .keys()
      .value()
    const sourceDir = path.resolve(item, 'src')
    const outputDir = path.resolve(item, 'dist')
    return {
      varname,
      dirname,
      packagePath: item,
      sourceDir,
      outputDir,
      deps,
      name,
      sort: 0,
    }
  })
  // 优先级
  for (let i = 0; i < pkgs.length; i++) {
    const subject = pkgs[i]
    for (let j = 0; j < pkgs.length; j++) {
      const object = pkgs[j]
      if (object.name !== subject.name) {
        if (object.deps.includes(subject.name)) {
          subject.sort++
        }
      }
    }
  }

  const res = pkgs.sort((a, b) => b.sort - a.sort)
  return res
}

function buildOutput(pkg, globals, formatters) {
  formatters = formatters ?? [
    ['cjs', 'index.cjs'],
    ['es', 'index.mjs'],
    ['umd', 'index.umd.js'],
  ]

  return formatters.map(([format, filename]) => {
    return {
      inlineDynamicImports: true,
      file: path.resolve(pkg.outputDir, filename),
      format,
      name: pkg.varname,
      globals,
    }
  })
}
function buildExternals(pkgs = []) {
  const allPkg = [
    ...libs,
    ...pkgs.map((item) => ({ pkg: item.name, varname: item.varname })),
  ]
  const globals = allPkg.reduce((acc, item) => {
    return {
      [item.pkg]: item.varname,
      ...acc,
    }
  }, {})
  const externals = allPkg.map((item) => item.pkg)
  return {
    globals,
    externals,
  }
}

function createPlugins(pkg) {
  return [
    typescript({
      // sourceMap: true,
      tsconfig: path.resolve(pkg.packagePath, 'tsconfig.json'),
    }),
    nodeResolve(),
    image(),
    commonjs(),
    json(),

    // urlPlugin(),

    postcss({
      plugins: [
        tailwindcss(),
        autoprefixer(),
        postcssUrl({
          url: 'inline', // enable inline assets using base64 encoding
          maxSize: 10, // maximum file size to inline (in kilobytes)
          fallback: 'copy', // fallback method to use if max size is exceeded
        }),
      ],
      extract: true,
      to: 'style.css',
      use: {
        sass: {
          silenceDeprecations: ['legacy-js-api'],
          includePaths: [
            path.resolve(__dirname, './package/client-kits/styles/include'),
          ],
        },
      },
    }),
  ]
}
function buildRollupConfig() {
  const pkgs = buildPkgsInfo()

  const { globals, externals } = buildExternals(pkgs)
  const config = pkgs.map((item) => {
    return {
      input: path.resolve(item.sourceDir, 'index.ts'),
      output: buildOutput(item, globals),
      treeshake: true,
      external: externals,
      plugins: createPlugins(item),
    }
  })

  return config
}

const config = buildRollupConfig()

export default config
