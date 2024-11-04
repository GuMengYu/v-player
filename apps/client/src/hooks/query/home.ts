import { useQuery } from '@tanstack/react-query'
import { personalizedPlaylist, personalizedRadar, personalizedSong } from '@/api/personalized'
import { getPlaylistDetail } from '@/api/playlist'
import { specialType } from '@/util/metadata'

export function useQueryPersonalizedPlaylists() {
  return useQuery(['personalized', 'playlists'], () => personalizedPlaylist(), {
    staleTime: 5 * 60 * 1000,
  })
}

export function useQueryPersonalizedNewAlbums() {
  return useQuery(['personalized', 'new_albums'], () => personalizedSong(), {
    staleTime: 5 * 60 * 1000,
  })
}

export function useQueryPersonalizedRadarPlaylists() {
  return useQuery(['personalized', 'radar_playlists'], () => personalizedRadar(), {
    staleTime: 5 * 60 * 1000,
  })
}

export function useQueryPersonalRadarPlaylist() {
  return useQuery(['personalized', 'radar_playlists', 'personal', 'detail'], () => getPlaylistDetail(specialType.radar.id), {
    staleTime: 5 * 60 * 1000,
  })
}
