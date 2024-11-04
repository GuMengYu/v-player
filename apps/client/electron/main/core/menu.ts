import type { BrowserWindow } from 'electron'
import { Menu, app, shell } from 'electron'
import is from 'electron-is'

import { name } from '../../../package.json'

const isMac = process.platform === 'darwin'
export function createElectronMenu(window: BrowserWindow) {
  const template: any = [
    ...(is.macOS()
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about', label: `关于 ${name}` },
              {
                role: 'preferences',
                label: '设置',
                accelerator: (() => (isMac ? 'CmdOrCtrl+,' : 'Ctrl+,'))(),
                click: () => {
                  window.webContents.send('open-route', '/setting')
                },
              },
              { type: 'separator' },
              { role: 'hide', label: `隐藏${name}` },
              { role: 'hideothers', label: '隐藏其他应用' },
              { role: 'unhide', label: '显示全部' },
              { type: 'separator' },
              { role: 'quit', label: `退出${name}` },
            ],
          },
        ]
      : []),
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'delete', label: '删除' },
        { role: 'selectAll', label: '全选' },
        {
          label: '搜索',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            window.webContents.send('search')
          },
        },
      ],
    },
    {
      label: '播放',
      submenu: [
        {
          label: '播放/暂停',
          accelerator: 'Space',
          click: () => {
            window.webContents.send('playOrPause')
          },
        },
        {
          label: '下一首',
          accelerator: 'CmdOrCtrl+Right',
          click: () => {
            window.webContents.send('next')
          },
        },
        {
          label: '上一首',
          accelerator: 'CmdOrCtrl+Left',
          click: () => {
            window.webContents.send('prev')
          },
        },
        {
          label: '音量+',
          accelerator: 'CmdOrCtrl+Up',
          click: () => {
            window.webContents.send('volumeUp')
          },
        },
        {
          label: '音量-',
          accelerator: 'CmdOrCtrl+Down',
          click: () => {
            window.webContents.send('volumeDown')
          },
        },
        {
          label: '静音',
          accelerator: 'CmdOrCtrl+M',
          click: () => {
            window.webContents.send('mute')
          },
        },
      ],
    },
    {
      label: '窗口',
      submenu: [
        { role: 'close', label: '关闭' },
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        { type: 'separator' },
        {
          label: '后退',
          accelerator: 'CmdOrCtrl+[',
          click: () => {
            window.webContents.goBack()
          },
        },
        {
          label: '前进',
          accelerator: 'CmdOrCtrl+]',
          click: () => {
            window.webContents.goForward()
          },
        },
        { role: 'reload', label: '刷新' },
        { role: 'forcereload', label: '强制刷新' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '日志目录',
          click: async () => {
            const path = app.getPath('logs')
            await shell.openPath(path)
          },
        },
        {
          label: '用户数据',
          click: async () => {
            const path = app.getPath('userData')
            console.log(path)

            await shell.openPath(path)
          },
        },
        // ...(is.dev()
        //   ? [
        //       {
        //         label: '开发者工具',
        //         accelerator: 'F12',
        //         click: () => {
        //           window.webContents.toggleDevTools()
        //         },
        //       },
        //     ]
        //   : []),
        {
          label: '开发者工具',
          accelerator: 'F12',
          click: () => {
            window.webContents.toggleDevTools()
          },
        },
        ...(is.dev()
          ? [
              {
                label: '演练场',
                click: () => {
                  window.webContents.send('open-route', '/playground')
                },
              },
            ]
          : []),
        {
          label: '问题&反馈',
          click: async () => {
            await shell.openExternal('https://github.com/GuMengYu/music-you/issues')
          },
        },
        {
          label: '重置应用',
          click: async () => {
            window.webContents.send('reset-app')
          },
        },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(<any>template))
}
