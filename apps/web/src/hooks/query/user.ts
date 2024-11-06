import { useQuery } from '@tanstack/react-query'
import { favAlbums, favArtists, favMVs } from '@/api/user'

export function useUserArtists() {
  const key = ['user', 'artists']
  return useQuery(
    key,
    async () => {
      const { data } = await favArtists()
      return {
        artists: data,
      }
    },
  )
}

export function useUserAlbums() {
  const key = ['user', 'albums']
  return useQuery(
    key,
    async () => {
      const { data } = await favAlbums()
      return {
        albums: data,
      }
    },
  )
}

export function useUserMVs() {
  const key = ['user', 'mvs']
  return useQuery(
    key,
    async () => {
      const { data } = await favMVs()
      return {
        mvs: data,
      }
    },
  )
}
