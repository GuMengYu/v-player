import { URL } from 'node:url'
import { app, dialog, ipcMain, shell } from 'electron'

import is from 'electron-is'
import { WindowState } from '../../../shared/types'
import { downloadFile, downloadTrack } from './util/download'
import log from './util/log'
import store from './util/store'
import YoutubeFinder from './util/youtube'
import type WindowManager from './windowManager'
import { WindowDefaultSize } from './windowManager'

export function registerIpcMain(windowManager: WindowManager) {
  const { open, proxy } = store.get('youtube')
  if (open) {
    log.info('[main] init youtubeFinder', proxy)
    const url = new URL(proxy)
    const youtubeFinder = new YoutubeFinder({
      proxy: {
        host: url.hostname,
        port: +url.port,
        protocol: url.protocol,
      },
    })
    ipcMain.handle('getTrackFromYoutube', async (e, artist, name) => {
      return youtubeFinder.matchTrack(artist, name)
    })
  }

  const window = windowManager.getWindow('index')
  // ipcMain.handle('minimalWindow', () => {
  //   windowManager.openWindow('minimal')
  // })
  ipcMain.handle('zoom-window', () => {
    if (window.isMaximized())
      window.unmaximize()
    else
      window.maximize()
  })
  ipcMain.handle('downloadFile', (_e, data) => {
    downloadFile(data)
  })
  ipcMain.handle('downloadTrack', (_e, data) => {
    downloadTrack(data)
  })
  ipcMain.handle(WindowState.MINIMIZED, () => {
    window.minimize()
  })
  ipcMain.handle(WindowState.MAXIMIZED, () => {
    if (window.isMaximized())
      window.unmaximize()
    else
      window.maximize()
  })
  ipcMain.handle(WindowState.NORMAL, () => {
    console.log(window.isMaximizable(), window.isMaximized())
    window.unmaximize()
  })
  ipcMain.handle(WindowState.CLOSED, () => {
    app.quit()
  })
  ipcMain.handle(WindowState.MINIMIZEDTRAY, () => {
    window.close()
  })
  ipcMain.handle('open-url', (e, url) => {
    console.log('open url')
    try {
      shell.openExternal(url)
    }
    catch (e) {
      log.error('open external url failed', e)
    }
  })
  ipcMain.handle('capturePage', async () => {
    const nativeImage = await window.capturePage()
    const buffer = nativeImage.toBitmap()
    const { width, height } = nativeImage.getSize()
    return {
      buffer,
      width,
      height,
    }
  })
  let cacheSize: number[] = []
  ipcMain.handle('adjustWidth', async () => {
    const aspectRatio = 2
    const [width, height] = window.getSize()
    console.log('adjustWidth: current', width, height)
    cacheSize = [width, height]
    const resizedWidth = height * aspectRatio
    if (resizedWidth !== width)
      window.setSize(resizedWidth, height, true)

    console.log('adjustWidth: resized', resizedWidth)

    return resizedWidth
  })
  ipcMain.handle('restoreSize', () => {
    const [width, height] = cacheSize
    if (width && height)
      window.setSize(width, height, true)
    else
      window.setSize(WindowDefaultSize.width, WindowDefaultSize.height, true)
  })
  ipcMain.handle('setSize', (e, payload) => {
    const { width, height } = payload
    if (width && height)
      window.setSize(width, height, true)
  })
  ipcMain.handle('minimal', (e, open) => {
    log.info('[main] minimal player')
    if (open) {
      store.set('minimal', true)
      store.set('windowPosition', window.getPosition())
      window.setSize(144, 144, true)

      if (is.macOS())
        window.setWindowButtonVisibility(false)

      window.setAlwaysOnTop(true)
    }
    else {
      store.set('minimal', false)
      window.setAlwaysOnTop(false)
      try {
        const { height, width } = store.get('windowSize')
        const position = store.get('windowPosition')
        if (position)
          window.setPosition(position[0], position[1])

        window.setSize(width, height, true)
        if (is.macOS())
          window.setWindowButtonVisibility(true)
      }
      catch (e) {
        log.error('[main] close minimal error')
      }
    }
  })
  ipcMain.handle('setProgress', (e, progress) => {
    window.setProgressBar(progress)
  })
  ipcMain.handle('updateYoutubeConfig', (e, payload) => {
    try {
      log.info('[main]: updateYoutubeConfig', payload)
      const data = JSON.parse(payload)
      store.set('youtube', data)
    }
    catch (e) {
      log.error('[main]: updateYoutubeConfig error', e)
    }
  })
  ipcMain.handle('relaunch', () => {
    dialog.showMessageBox(window, {
      type: 'info',
      buttons: ['取消', '确定'],
      defaultId: 1,
      title: '重启应用',
      message: '确定重新启动应用？',
    }).then(({ response }) => {
      if (response === 1) {
        log.info('[main]: app relaunch')
        app.relaunch()
        app.quit()
      }
    })
  })
  ipcMain.handle('relaunch-direct', () => {
    app.relaunch()
    app.quit()
  })

  ipcMain.handle('reset', async () => {
    const { response } = await dialog.showMessageBox(window, {
      type: 'info',
      buttons: ['取消', '确定'],
      defaultId: 1,
      title: '重置应用',
      message: '重置应用状态，将会退出登录，所有设置恢复到安装时的状态',
    })
    if (response === 1) {
      log.info('[main]: app reset')
      store.clear()
      return true
    }
    else {
      return false
    }
  })

  ipcMain.handle('reset-direct', () => {
    store.clear()
  })
}
