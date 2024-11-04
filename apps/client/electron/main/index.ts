import { release } from 'node:os'
import { join } from 'node:path'

import type * as http from 'node:http'

import { BrowserWindow, Menu, app } from 'electron'
import is from 'electron-is'
import log from 'electron-log'

import { enable, initialize as initializeElectronRemote } from '@electron/remote/main'
import { useStaticServer } from './core/appStataicServer'
import { registerIpcMain } from './core/ipcMain'
import { createElectronMenu } from './core/menu'
import { useNetEaseApiServer } from './core/neteaseapi/apiserver'
import { createTray } from './core/tray'
import WindowManager from './core/windowManager'
import { useLocalLibraryService } from './local-library'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

let appStaticServer: http.Server
let wm: WindowManager

preCheck()
bootstrap()

function bootstrap() {
  log.info('[main] bootstrap')
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    return app.quit()
  }
  else {
    app.on('second-instance', () => {
      // 当运行第二个实例时,将会聚焦到前一个实例的窗口
      const window = wm.getWindow('index')
      if (window) {
        window.show()
        if (window.isMinimized())
          window.restore()
        window.focus()
      }
    })
  }
  handleAppEvent()
}

function handleAppEvent() {
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS, it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
      app.quit()
  })

  app.on('activate', () => {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (wm) {
      if (BrowserWindow.getAllWindows().length === 0)
        wm.openWindow('index')
      else wm.getWindow('index')?.show()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    // protocol.handle('track', (request) => {
    //   let url = request.url
    //   const { host, port, pathname, search } = new URL(url)
    //   if (is.windows())
    //     url = `file://${host}:${port}${pathname}${search}`
    //   else
    //     url = `file:///${host}${port}${pathname}${search}`
    //   return net.fetch(url, { keepalive: true })
    // })

    // install extensions
    // await installExtensions()
    // Exit cleanly on request from parent process in development mode.
    if (is.dev()) {
      if (process.platform === 'win32') {
        process.on('message', (data) => {
          if (data === 'graceful-exit')
            app.quit()
        })
      }
      else {
        process.on('SIGTERM', () => {
          app.quit()
        })
      }
    }
    await useNetEaseApiServer({
      port: import.meta.env['VITE_API_SERVER_PORT'],
      host: import.meta.env['VITE_API_SERVER_HOST'],
    })
    if (is.production()) {
      // web静态资源express托管
      useStaticServer()
    }
    wm = new WindowManager()
    const window = await wm.openWindow('index')
    if (window) {
      initializeElectronRemote()
      enable(window.webContents)
      createElectronMenu(window)
      createTray(window)
      registerIpcMain(wm)
      await useLocalLibraryService()
    }
  })
  app.on('quit', () => {
    appStaticServer && appStaticServer.close()
  })
  app.on('before-quit', () => {
    wm.willQuit = true
  })
}

function preCheck() {
  // Scheme must be registered before the app is ready
  // protocol.registerSchemesAsPrivileged([
  //   {
  //     scheme: 'track',
  //     privileges: {
  //       secure: true,
  //       standard: true,
  //       corsEnabled: true,
  //       stream: true,
  //       supportFetchAPI: true,
  //     },
  //   },
  // ])
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1'))
    app.disableHardwareAcceleration()

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32')
    app.setAppUserModelId(app.getName())

  Menu.setApplicationMenu(null)
}
export const getWin = () => wm.getWindow('index')

// // Disable GPU Acceleration for Windows 7
// if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// // Set application name for Windows 10+ notifications
// if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// if (!app.requestSingleInstanceLock()) {
//   app.quit()
//   process.exit(0)
// }

// // Remove electron security warnings
// // This warning only shows in development mode
// // Read more on https://www.electronjs.org/docs/latest/tutorial/security
// // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// let win: BrowserWindow | null = null
// // Here, you can also use other preload
// const preload = join(__dirname, '../preload/index.js')
// const url = process.env.VITE_DEV_SERVER_URL
// const indexHtml = join(process.env.DIST, 'index.html')

// async function createWindow() {
//   win = new BrowserWindow({
//     title: 'Main window',
//     icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
//     webPreferences: {
//       preload,
//       // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
//       // Consider using contextBridge.exposeInMainWorld
//       // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (url) { // electron-vite-vue#298
//     win.loadURL(url)
//     // Open devTool if the app is not packaged
//     win.webContents.openDevTools()
//   } else {
//     win.loadFile(indexHtml)
//   }

//   // Test actively push message to the Electron-Renderer
//   win.webContents.on('did-finish-load', () => {
//     win?.webContents.send('main-process-message', new Date().toLocaleString())
//   })

//   // Make all links open with the browser, not with the application
//   win.webContents.setWindowOpenHandler(({ url }) => {
//     if (url.startsWith('https:')) shell.openExternal(url)
//     return { action: 'deny' }
//   })

//   // Apply electron-updater
//   update(win)
// }

// app.whenReady().then(createWindow)

// app.on('window-all-closed', () => {
//   win = null
//   if (process.platform !== 'darwin') app.quit()
// })

// app.on('second-instance', () => {
//   if (win) {
//     // Focus on the main window if the user tried to open another
//     if (win.isMinimized()) win.restore()
//     win.focus()
//   }
// })

// app.on('activate', () => {
//   const allWindows = BrowserWindow.getAllWindows()
//   if (allWindows.length) {
//     allWindows[0].focus()
//   } else {
//     createWindow()
//   }
// })

// // New window example arg: new windows url
// ipcMain.handle('open-win', (_, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (process.env.VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${url}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })
