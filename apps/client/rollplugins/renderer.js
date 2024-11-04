import fs from 'node:fs'
import path from 'node:path'
import { builtinModules, createRequire } from 'node:module'
import os from 'node:os'
import { normalizePath as normalizePath$1 } from 'vite'
import esbuild from 'esbuild'

const keywords = [
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words
  ...[
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'null',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    // The following are only reserved when they are found in strict mode code
    'const',
    'let',
    'static',
    'yield',
    // The following are only reserved when they are found in module code or async function bodies
    'await',
  ],
  ...[
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#future_reserved_words
    'enum',
    // The following are only reserved when they are found in strict mode code
    'implements',
    'interface',
    'package',
    'private',
    'protected',
    'public',
    // Future reserved words in older standards
    // The following are reserved as future keywords by older ECMAScript specifications (ECMAScript 1 till 3).
    'abstract',
    'boolean',
    'byte',
    'char',
    'double',
    'final',
    'float',
    'goto',
    'int',
    'long',
    'native',
    'short',
    'synchronized',
    'throws',
    'transient',
    'volatile',
  ],
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers_with_special_meanings
  ...[
    'arguments',
    'as',
    'async',
    'eval',
    'from',
    'get',
    'of',
    'set',
  ],
]
function libEsm(options) {
  const {
    window,
    require: require22,
    exports: members = [],
    conflict = '',
  } = options
  const _M_ = `_M_${conflict}`
  const windowSnippet = window == null ? '' : `const ${_M_} = window["${window}"];`
  const requireSnippet = require22 == null
    ? ''
    : `
import { createRequire } from "node:module";
const ${_M_} = createRequire(import.meta.url)("${require22}");
`.trim()
  !members.includes('default') && members.push('default')
  const alias = members.filter(member => keywords.includes(member)).reduce((memo, keyword) => Object.assign(memo, { [keyword]: `keyword_${keyword + conflict}` }), {})
  const exportsSnippet = `
${members.map((member) => {
    const LV = alias[member] ? `const ${alias[member]}` : `export const ${member}`
    const RV = member === 'default' ? `${_M_}.default || ${_M_}` : `${_M_}.${member}`
    return `${LV} = ${RV};`
  }).join('\n')}
export {
  ${Object.entries(alias).map(([member, alias2]) => `${alias2} as ${member},`).join('\n  ')}
};
`.trim()
  return {
    /** `window[iife-name]` snippets */
    window: windowSnippet,
    /** `require(id)` snippets */
    require: requireSnippet,
    /** `export` snippets */
    exports: exportsSnippet,
    /** Keywords alias */
    keywords: alias,
  }
}
function relativeify(relative) {
  if (relative === '')
    return '.'

  if (!relative.startsWith('./') || !relative.startsWith('.\\'))
    return `./${relative}`

  return relative
}
const isWindows = os.platform() === 'win32'
function slash(p) {
  return p.replace(/\\/g, '/')
}
function normalizePath(id) {
  return path.posix.normalize(isWindows ? slash(id) : id)
}
const COLOURS = {
  $: c => str => `\x1B[${c}m${str}\x1B[0m`,
  gary: str => COLOURS.$(90)(str),
  cyan: str => COLOURS.$(36)(str),
  yellow: str => COLOURS.$(33)(str),
  green: str => COLOURS.$(32)(str),
  red: str => COLOURS.$(31)(str),
}
const VOLUME_RE = /^[A-Z]:/i
function node_modules(root, paths = []) {
  if (!root)
    return paths
  if (!(root.startsWith('/') || VOLUME_RE.test(root)))
    return paths
  const p = path.posix.join(normalizePath(root), 'node_modules')
  if (fs.existsSync(p) && fs.statSync(p).isDirectory())
    paths = paths.concat(p)

  root = path.posix.join(root, '..')
  return root === '/' || /^[A-Z]:$/i.test(root) ? paths : node_modules(root, paths)
}
const require2 = createRequire(import.meta.url)
const builtins = builtinModules.filter(m => !m.startsWith('_'))
const electronBuiltins = [
  'electron',
  ...builtins,
  ...builtins.map(module => `node:${module}`),
]
const CACHE_DIR = '.vite-electron-renderer'
const TAG = '[electron-renderer]'
const cwd = normalizePath$1(process.cwd())
const electron = `
const electron = typeof require !== 'undefined'
  // All exports module see https://www.electronjs.org -> API -> Renderer process Modules
  ? (function requireElectron() {
    const avoid_parse_require = require;
    return avoid_parse_require("electron");
  }())
  : (function nodeIntegrationWarn() {
    console.error(\`If you need to use "electron" in the Renderer process, make sure that "nodeIntegration" is enabled in the Main process.\`);
    return {
      // TODO: polyfill
    };
  }());

// Proxy in Worker
let _ipcRenderer;
if (typeof document === 'undefined') {
  _ipcRenderer = {};
  const keys = [
    'invoke',
    'postMessage',
    'send',
    'sendSync',
    'sendTo',
    'sendToHost',
    // propertype
    'addListener',
    'emit',
    'eventNames',
    'getMaxListeners',
    'listenerCount',
    'listeners',
    'off',
    'on',
    'once',
    'prependListener',
    'prependOnceListener',
    'rawListeners',
    'removeAllListeners',
    'removeListener',
    'setMaxListeners',
  ];
  for (const key of keys) {
    _ipcRenderer[key] = () => {
      throw new Error(
        'ipcRenderer doesn\\'t work in a Web Worker.\\n' +
        'You can see https://github.com/electron-vite/vite-plugin-electron/issues/69'
      );
    };
  }
} else {
  _ipcRenderer = electron.ipcRenderer;
}

export { electron as default };
export const clipboard = electron.clipboard;
export const contextBridge = electron.contextBridge;
export const crashReporter = electron.crashReporter;
export const ipcRenderer = _ipcRenderer;
export const nativeImage = electron.nativeImage;
export const shell = electron.shell;
export const webFrame = electron.webFrame;
export const deprecate = electron.deprecate;
export const dialog = electron.dialog;
`.trim()
function renderer(options = {}) {
  let root
  let cacheDir
  const resolveKeys = []
  const moduleCache = /* @__PURE__ */ new Map()
  return {
    name: 'vite-plugin-electron-renderer',
    async config(config, { command }) {
      root = normalizePath$1(config.root ? path.resolve(config.root) : cwd)
      cacheDir = path.posix.join(node_modules(root)[0] ?? cwd, CACHE_DIR)
      for (const [key, option] of Object.entries(options.resolve ?? {})) {
        if (command === 'build' && option.type === 'esm')
          continue

        resolveKeys.push(key)
      }
      const aliases = [{
        find: new RegExp(`^(?:node:)?(${['electron', ...builtins].join('|')})$`),
        // https://github.com/rollup/plugins/blob/alias-v5.0.0/packages/alias/src/index.ts#L90
        replacement: '$1',
        async customResolver(source) {
          let id = moduleCache.get(source)
          if (!id) {
            id = `${path.posix.join(cacheDir, source)}.mjs`
            if (!fs.existsSync(id)) {
              ensureDir(path.dirname(id))
              fs.writeFileSync(
                // lazy build
                id,
                source === 'electron' ? electron : getSnippets({ import: source, export: source }),
              )
            }
            moduleCache.set(source, id)
          }
          return { id }
        },
      }]
      resolveKeys.length && aliases.push({
        find: new RegExp(`^(${resolveKeys.join('|')})$`),
        replacement: '$1',
        async customResolver(source, importer, resolveOptions) {
          let _a
          let id = moduleCache.get(source)
          if (!id) {
            const filename = `${path.posix.join(cacheDir, source)}.mjs`
            if (fs.existsSync(filename)) {
              id = filename
            }
            else {
              // eslint-disable-next-line no-cond-assign
              const resolved = (_a = options.resolve) == null ? undefined : _a[source]
              if (resolved) {
                let snippets
                if (typeof resolved.build === 'function') {
                  snippets = await resolved.build({
                    cjs: module => Promise.resolve(getSnippets({ import: module, export: module })),
                    esm: (module, buildOptions) => getPreBundleSnippets({
                      module,
                      outdir: cacheDir,
                      buildOptions,
                    }),
                  })
                }
                else if (resolved.type === 'cjs') {
                  snippets = getSnippets({ import: source, export: source })
                }
                else if (resolved.type === 'esm') {
                  snippets = await getPreBundleSnippets({
                    module: source,
                    outdir: cacheDir,
                  })
                }
                console.log(
                  COLOURS.gary(TAG),
                  COLOURS.cyan('pre-bundling'),
                  COLOURS.yellow(source),
                )
                ensureDir(path.dirname(filename))
                fs.writeFileSync(filename, snippets ?? `/* ${TAG}: empty */`)
                id = filename
              }
              else {
                id = source
              }
            }
            moduleCache.set(source, id)
          }
          return id === source
            ? this.resolve(
              source,
              importer,
              Object.assign({ skipSelf: true }, resolveOptions),
            ).then(resolved => resolved || { id: source })
            : { id }
        },
      })
      modifyAlias(config, aliases)
      modifyOptimizeDeps(config, resolveKeys)
      adaptElectron(config)
    },
  }
}
function adaptElectron(config) {
  let _a
  config.base ?? (config.base = './')
  config.build ?? (config.build = {});
  (_a = config.build).rollupOptions ?? (_a.rollupOptions = {})
  setOutputFreeze(config.build.rollupOptions)
  withIgnore(config.build, electronBuiltins)
}
function setOutputFreeze(rollupOptions) {
  let _a
  rollupOptions.output ?? (rollupOptions.output = {})
  if (Array.isArray(rollupOptions.output)) {
    for (const o of rollupOptions.output)
      o.freeze ?? (o.freeze = false)
  }
  else {
    (_a = rollupOptions.output).freeze ?? (_a.freeze = false)
  }
}
function withIgnore(configBuild, modules) {
  configBuild.commonjsOptions ?? (configBuild.commonjsOptions = {})
  if (configBuild.commonjsOptions.ignore) {
    if (typeof configBuild.commonjsOptions.ignore === 'function') {
      const userIgnore = configBuild.commonjsOptions.ignore
      configBuild.commonjsOptions.ignore = (id) => {
        if ((userIgnore == null ? undefined : userIgnore(id)) === true)
          return true

        return modules.includes(id)
      }
    }
    else {
      configBuild.commonjsOptions.ignore.push(...modules)
    }
  }
  else {
    configBuild.commonjsOptions.ignore = modules
  }
}
function modifyOptimizeDeps(config, exclude) {
  let _a
  config.optimizeDeps ?? (config.optimizeDeps = {});
  (_a = config.optimizeDeps).exclude ?? (_a.exclude = [])
  for (const str of exclude) {
    if (!config.optimizeDeps.exclude.includes(str))
      config.optimizeDeps.exclude.push(str)
  }
}
function modifyAlias(config, aliases) {
  let _a
  config.resolve ?? (config.resolve = {});
  (_a = config.resolve).alias ?? (_a.alias = [])
  if (Object.prototype.toString.call(config.resolve.alias) === '[object Object]')
    config.resolve.alias = Object.entries(config.resolve.alias).reduce((memo, [find, replacement]) => memo.concat({ find, replacement }), [])

  config.resolve.alias.push(...aliases)
}
function getSnippets(module) {
  const { exports } = libEsm({
    exports: Object.getOwnPropertyNames(
    /* not await import */
      require2(module.import),
    ),
  })
  return `const avoid_parse_require = require; const _M_ = avoid_parse_require("${module.export}");
${exports}`
}
async function getPreBundleSnippets(options) {
  const {
    module,
    outdir,
    buildOptions = {},
  } = options
  const outfile = `${path.posix.join(outdir, module)}.cjs`
  await esbuild.build({
    entryPoints: [module],
    outfile,
    target: 'node14',
    format: 'cjs',
    bundle: true,
    sourcemap: 'inline',
    platform: 'node',
    external: electronBuiltins,
    ...buildOptions,
  })
  return getSnippets({
    import: outfile,
    // `require()` in script-module lookup path based on `process.cwd()` 🤔
    export: relativeify(path.posix.relative(cwd, outfile)),
  })
}
function ensureDir(dirname) {
  if (!fs.existsSync(dirname))
    fs.mkdirSync(dirname, { recursive: true })
}
export {
  renderer as default,
  electron,
}
