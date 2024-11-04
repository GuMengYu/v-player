import { ipcRenderer } from 'electron'

export async function getLocalTrack(id: number) {
  try {
    return ipcRenderer.invoke('track/get-track', id)
  }
  catch (e) {}
}

export async function getLocalAlbumTrack(albumKey: string) {
  try {
    const { data } = await ipcRenderer.invoke('track/get-album-tracks', albumKey)
    return data
  }
  catch (e) {}
}
