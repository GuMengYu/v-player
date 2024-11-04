import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'
import { client as queryClient } from '@/plugins/query'
import { getLocalAlbumTrack } from '@/api/local'

export async function queryAlbumTracks(albumKey: string) {
  return await queryClient.fetchQuery({
    queryKey: ['local', 'album', 'tracks', albumKey],
    queryFn: async () => {
      const tracks = await getLocalAlbumTrack(albumKey)
      return tracks ?? []
    },
    staleTime:  5 * 1000 * 60,
  })
}

export function useQueryAlbumTracks(albumKey: string) {
  const { data, isLoading, refetch } = useQuery(['local', 'album', 'tracks', albumKey], async () => {
    const tracks = await getLocalAlbumTrack(albumKey)
    return tracks ?? []
  }, {
    staleTime: 5 * 1000 * 60,
  })
  return {
    data,
    isLoading,
    refetch,
  }
}

export function useQueryAlbums() {
  const { data, isLoading } = useQuery(['local', 'albums'], async () => {
    const albums = await ipcRenderer.invoke('album/all-albums')
    return {
      albums,
    }
  }, {
    staleTime: 5 * 1000 * 60,
  })
  return {
    data,
    isLoading,
  }
}

export function useQueryAlbumForArtist(artistName: string) {
  const { data, isLoading } = useQuery(['local', 'albums', artistName], async () => {
    const albums = await ipcRenderer.invoke('album/artist-albums', [artistName], 3)
    return {
      albums,
    }
  }, {
    staleTime: 5 * 1000 * 60,
  })
  return {
    data,
    isLoading,
  }
}
