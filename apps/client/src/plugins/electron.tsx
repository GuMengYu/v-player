import { ipcRenderer } from 'electron'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { Button } from '@mui/material'
import { player } from '@/contexts/player'
import router from '@/router'

// const toast = useSnackbar()

import is from '@/util/is'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'

export function useElectron() {
  if (is.electron())
    registerIpcRenderer()
}

function registerIpcRenderer() {
  // const playerStore = usePlayerStore()
  // const appStore = useAppStore()
  // const player = usePlayerOutsideComponent()
  // // const showDownloadComplete = once((name) => {
  // //   toast.success(`下载成功 ${name}`)
  // // })
  let cacheVolume = 0.8
  ipcRenderer.on('open-route', (_, path) => {
    router.navigate(path)
    // router.push({ name: routeName })
  })
  // // ipcRenderer.on('search', () => {
  // //   appStore.$state.showSearch = !appStore.$state.showSearch
  // // })
  ipcRenderer.on('next', () => {
    player.next()
  })
  ipcRenderer.on('prev', () => {
    player.prev()
  })
  ipcRenderer.on('playOrPause', () => {
    player.togglePlay()
  })
  ipcRenderer.on('volumeUp', () => {
    const volume = usePlayerStore.getState().volume
    player.setVolume(volume + 0.05)
  })
  ipcRenderer.on('volumeDown', () => {
    const volume = usePlayerStore.getState().volume
    player.setVolume(volume - 0.05)
  })
  ipcRenderer.on('mute', () => {
    const volume = usePlayerStore.getState().volume
    if (volume === 0) {
      player.setVolume(cacheVolume)
    }
    else {
      cacheVolume = player.volume
      player.setVolume(0)
    }
  })
  ipcRenderer.on('search', () => {
    useAppStore.getState().toggleSearch()
  })
  // ipcRenderer.on('fullscreen', (e, fullscreen) => {
  //   // appStore.$state.showLyricsPage = fullscreen
  // })
  ipcRenderer.on('startDownload', (e, data) => {
    // console.log('startDownload', e, data)
    // window?.app?.$toast(`开始下载 ${data.name}`, {
    //   color: 'info',
    // })
  })
  // ipcRenderer.on('downloadProgress', (e, data) => {
  //   const { percent } = data
  //   // playerStore.commit('app/downloadprogress', percent)
  // })
  ipcRenderer.on('downloadCompleted', (e, file, fileName) => {
    let action
    if (file.dir) {
      action = (snackbarId: any) => (
        <>
          <Button onClick={() => {
            ipcRenderer.invoke('base/open-path', file.dir)
          }}>
            打开目录
          </Button>
          <Button onClick={() => { closeSnackbar(snackbarId) }}>
            关闭
          </Button>
        </>
      )
    }

    const { path } = file
    enqueueSnackbar(`${fileName} 已下载到:${path}`, {
      action,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      variant: 'success',
      autoHideDuration: 5000,
    })
  })
  //
  //   // playerStore.commit('app/downloadprogress', 0)
  // })
  ipcRenderer.on('windowState', (e, state) => {
    useAppStore.setState({
      windowState: state,
    })
  })
  ipcRenderer.on('snackbar-add-tracks', (e, data, data2) => {
    console.log(data, data2)
  })
  ipcRenderer.on('snackbar-indexing', (e, indexing) => {
    if (indexing === 'start')
      enqueueSnackbar({ message: '开始检索歌曲', variant: 'warning', autoHideDuration: 3000 })

    else if (indexing === 'end')
      enqueueSnackbar({ message: '检索完成', variant: 'warning', autoHideDuration: 1000 })
  })
  ipcRenderer.on('reset-app', () => {
    resetApp()
  })
}

export function resetApp() {
  ipcRenderer.invoke('reset').then((confirm) => {
    if (confirm) {
      localStorage.clear()
      ipcRenderer.invoke('relaunch-direct')
    }
  })
}
