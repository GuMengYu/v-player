import { rmSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import swc from 'unplugin-swc'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from "vite-plugin-top-level-await";

// eslint-disable-next-line import/default
import electron from 'vite-plugin-electron'
import { defineConfig, loadEnv } from 'vite'
import renderer from './rollplugins/renderer.js'
import pkg, { dependencies, devDependencies, name, version } from './package.json'

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: new Date().toISOString(),
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const env = loadEnv(mode, path.resolve(__dirname, './'))

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const isElectron = mode === 'electron'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  const plugins: any = [
    react(),
    wasm(),
    topLevelAwait(),
  ]
  if (isElectron) {
    plugins.push(electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main/index.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG)
            console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
          else
            options.startup()
        },
        vite: {
          plugins: [
            swc.vite({
              jsc: {
                target: 'esnext', // override ts.config.json ESNext, avoid error notify
              },
            }),
          ],
          esbuild: false,
          build: {
            minify: isBuild,
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: Object.keys(dependencies ?? {}),
              watch: {
                exclude: 'electron/main/local-library/**',
              },
            },
          },
        },
      },
      {
        entry: 'electron/preload/index.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        },
        vite: {
          build: {
            sourcemap: sourcemap ? 'inline' : undefined, // #332
            minify: isBuild,
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
            },
          },
        },
      },
    ]),
    // Use Node.js API in the Renderer-process
    renderer())
  }

  return {
    mode,
    envDir: path.resolve(__dirname, './'),
    root: __dirname,
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'shared'),
      },
    },
    plugins,
    // server: process.env.VSCODE_DEBUG && (() => {
    //   const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
    //   return {
    //     host: url.hostname,
    //     port: +url.port,
    //   }
    // })(),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    build: {
      target: 'esnext',
    },
    server: {
      host: env.VITE_DEV_SERVER_HOST,
      port: +env.VITE_DEV_SERVER_PORT,
      proxy: {
        '/api': {
          target: `http://${env.VITE_API_SERVER_HOST}:${env.VITE_API_SERVER_PORT}`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      watch: {
        ignored: ['**/electron/main/local-library/**'],
      },
    },
    clearScreen: false,
  }
})
