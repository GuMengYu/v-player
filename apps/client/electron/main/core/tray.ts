import os from 'node:os'
import path, { join } from 'node:path'
import type { BrowserWindow } from 'electron'
import { Menu, Tray, app, nativeImage, nativeTheme } from 'electron'

let tray = null
const distPath = join(__dirname, '../../dist')
export function createTray(win: BrowserWindow) {
  const icon = nativeImage.createFromPath(getTrayIcon())
  tray = new Tray(icon)
  tray.setToolTip('Music-You')
  const menu = Menu.buildFromTemplate([
    {
      label: '显示 MusicYou',
      click: () => {
        win.show()
        win.focus()
      },
    },
    {
      label: '播放/暂停',
      click: () => {
        win.webContents.send('playOrPause')
      },
    },
    {
      label: '上一首',
      click: () => {
        win.webContents.send('prev')
      },
    },
    {
      label: '下一首',
      click: () => {
        win.webContents.send('next')
      },
    },
    {
      label: '退出',
      click: () => {
        app.quit()
      },
    },
  ])
  tray.setContextMenu(menu)
  handleEvents(tray, win)
}

function handleEvents(tray: Tray, win: BrowserWindow) {
  if (os.platform() === 'win32') {
    tray.on('click', () => {
      win.show()
    })
  }
}

function getTrayIcon(): string {
  if (os.platform() === 'darwin')
    return path.join(distPath, 'icon/trayTemplate.png')

  if (nativeTheme.shouldUseDarkColors)
    return path.join(distPath, os.platform() === 'win32' ? 'icon/tray_white.ico' : 'icon/tray_white.png')

  return path.join(distPath, os.platform() === 'win32' ? 'icon/tray_black.ico' : 'icon/tray_black.png')
}
