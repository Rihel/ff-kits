import * as changeCase from 'change-case'

import glob from 'glob'
import jetpack from 'fs-jetpack'
import path from 'path'
import { transform } from '@svgr/core'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const packagesRoot = path.resolve(__dirname, './packages')

const iconRoot = path.resolve(
  __dirname,
  './packages/client-kits/src/components/icon/',
)
const libRoot = path.resolve(iconRoot, './lib')
const svgFilesRoot = path.resolve(libRoot, './svg')
const svgIconsRoot = path.resolve(libRoot, './svg-icons')

const entryFile = path.resolve(libRoot, './custom-entry.tsx')

const readSvgs = () => {
  const files = glob.sync(path.resolve(svgFilesRoot, '**/*.svg'))
  return files.map((item) => {
    const name = item.replace(`${svgFilesRoot}/`, '').replace('.svg', '')
    return {
      name: changeCase.paramCase(name),
      path: `${name}.svg`,
      varname: changeCase.pascalCase(name),
      content: jetpack.read(item),
    }
  })
}

function generateCode(code) {
  return transform.sync(code, {
    jsxRuntime: 'automatic',
    // dimensions: false,
    expandProps: 'start',
    ref: true,
    typescript: true,
    memo: true,
    svgProps: {
      width: '1em',
      height: '1em',
      fill: 'currentColor',
    },
    replaceAttrValues: {
      '#8590A3': 'currentColor',
      '#4E5969': 'currentColor',
    },
    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
    icon: true,
  })
}

function generateIcons() {
  let entryContent = []
  readSvgs().forEach((svg) => {
    const code = generateCode(svg.content)
    const sourcePath = path.resolve(
      svgIconsRoot,
      svg.path.replace('.svg', '.tsx'),
    )
    const exportStatement = `export { default as ${svg.varname} } from './svg-icons/${svg.path.replace('.svg', '')}';`
    jetpack.write(sourcePath, code)
    entryContent.push(exportStatement)
  })

  jetpack.write(entryFile, entryContent.join('\n'))
}

generateIcons()
