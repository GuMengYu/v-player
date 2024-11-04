import { ipcRenderer } from 'electron'
import { LocalTrack } from '@shared/types'
import { client as queryClient } from '@/plugins/query'

export async function getLikedTracks() {
  return await queryClient.fetchQuery<{
    data: LocalTrack[]
  }>({
    queryKey: ['local', 'liked', 'tracks'],
    queryFn: async () => {
      return await ipcRenderer.invoke('track/liked-tracks')
    },
  })
}

export async function toggleTrackLike(trackId: number, liked: boolean) {
  return ipcRenderer.invoke('track/toggle-track-like', trackId, liked)
}
