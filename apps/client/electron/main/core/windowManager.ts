import { EventEmitter } from 'node:events'
import { join } from 'node:path'
import type { BrowserWindowConstructorOptions } from 'electron'
import { BrowserWindow, shell } from 'electron'
import is from 'electron-is'
import type Store from 'electron-store'

import { WindowState } from '../../../shared/types'
import type { Pages } from './config/page'
import pages from './config/page'
import log from './util/log'
import type { StoreType } from './util/store'
import store from './util/store'

export const WindowDefaultSize = {
  height: 670,
  width: 1000,
  minWidth: 144,
  minHeight: 144,
}

const defaultBrowserOptions: BrowserWindowConstructorOptions = {
  titleBarStyle: 'hidden',
  trafficLightPosition: { x: 9, y: 6 },
  // show: false,
  frame: !(is.windows() || is.linux()),
  width: 1000,
  height: 670,
  // vibrancy: 'ultra-dark',
  // visualEffectState: 'active',
  // transparent: true,
  backgroundColor: 'rgba(0,0,0,0)',
  roundedCorners: true,
  // hasShadow: false,
}
export default class WindowManager extends EventEmitter {
  windows: Record<Pages, BrowserWindow> | Record<string, never>
  willQuit: boolean
  size: {
    height: number
    width: number
  }

  store: Store<StoreType>
  constructor() {
    super()
    this.store = store

    this.windows = {}

    this.willQuit = false
    this.size = { height: WindowDefaultSize.height, width: WindowDefaultSize.width }

    this.initWindowSize()
  }

  async openWindow(page: Pages) {
    const pageOptions = this.getPageOption(page)

    let window = this.windows?.[page]
    if (window) {
      window?.show()
      window?.focus()
      return window
    }

    try {
      window = new BrowserWindow({
        ...defaultBrowserOptions,
        ...pageOptions,
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          contextIsolation: false,
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          webSecurity: false, // todo 关闭同源策略，问题在于加载本地音乐如果不是 file 协议，会造成设置进度失败
        },
      })
      this.windows[page] = window
      if (pageOptions.url)
        window.loadURL(pageOptions.url)

      this.initWindowListener(page)
      return window
    }
    catch (e) {
      log.info(e)
    }
  }

  getPageOption(page: Pages) {
    const option = pages[page]
    return option
  }

  initWindowListener(page: Pages) {
    const window = this.windows?.[page]
    if (window) {
      window?.on('enter-full-screen', () => {
        log.info('enter-full-screen')
        window.webContents.send('fullscreen', true)
      })
      window?.on('leave-full-screen', () => {
        log.info('leave-full-screen')
        window.webContents.send('fullscreen', false)
      })
      window?.on('close', (event) => {
        log.info('window close', this.willQuit)
        if (!this.willQuit) {
          event.preventDefault()
          if (window.isFullScreen()) {
            window.once('leave-full-screen', () => window.hide())
            window.setFullScreen(false)
          }
          else {
            window.hide()
          }
        }
      })
      window?.on('maximize', () => {
        log.info('window maximize')
        window?.webContents.send('windowState', WindowState.MAXIMIZED)
      })
      window?.on('unmaximize', () => {
        log.info('window unmaximize')
        window?.webContents.send('windowState', WindowState.NORMAL)
      })
      window?.on('minimize', () => {
        log.info('window minimize')
        window?.webContents.send('windowState', WindowState.MINIMIZED)
      })
      window?.on('restore', () => {
        log.info('window restore')
        window?.webContents.send('windowState', WindowState.NORMAL)
      })
      window?.on('resized', () => {
        const minimal = store.get('minimal')
        const [width, height] = window.getSize() ?? []

        log.info(`[main]: window resize height: ${height} width: ${width}`)

        if (!minimal) {
          log.info('[main]: store window size')
          this.store.set('windowSize', { width, height })
        }
      })
      window?.on('moved', () => {
        // log.info('[main]: window moved')
      })

      // Test active push message to Renderer-process
      window.webContents.on('did-finish-load', () => {
        window.webContents.send('main-process-message', new Date().toLocaleString())
      })

      // Make all links open with the browser, not with the application
      window.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:'))
          shell.openExternal(url)
        return { action: 'deny' }
      })
    }
  }

  initWindowSize() {
    const size = this.store.get('windowSize')
    if (!size) {
      this.size = { height: WindowDefaultSize.height, width: WindowDefaultSize.width }
      this.store.set('windowSize', this.size)
    }
    else {
      try {
        this.size = this.store.get('windowSize')
      }
      catch (e) {
        this.size = { height: WindowDefaultSize.height, width: WindowDefaultSize.width }
      }
    }
  }

  getWindow(page: Pages) {
    return this.windows[page]
  }

  getWindows() {
    return this.windows
  }

  getWindowList() {
    return Object.values(this.getWindows())
  }
}
