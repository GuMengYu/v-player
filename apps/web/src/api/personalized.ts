import { recommendPlaylist } from './user'
import { useUserStore } from '@/store/user'
import type { Playlist, Podcast, Track } from '@/types'
import { request } from '@/util/fetch'
import { RADARPLAYLISTS } from '@/util/metadata'

/**
 * 获取推荐歌单列表
 * @param {number} limit 返回数量限制
 * @returns
 */
export function personalized(limit?: number) {
  return request<{
    result: Playlist[]
  }>('/personalized', { params: { limit } })
}

export enum QueryKeys {
  personalizedPlaylist = 'personalizedPlaylist',
  personalizedMV = 'personalizedMV',
  personalizedRadar = 'personalizedRadar',
  personalizedPodcast = 'personalizedPodcast',
  personalizedSong = 'personalizedSong',
}
export async function personalizedPlaylist(limit = 8) {
  const isLogged = useUserStore.getState().account?.account?.id
  let result: Playlist[]
  if (isLogged) {
    const { recommend } = await recommendPlaylist()
    result = recommend.slice(1) // 第一个是私人定制雷达歌单，去除
  }
  else {
    const { result: list } = await personalized(limit)
    result = list
  }
  return result
}

/**
 * 获取推荐MV
 * @returns
 */
export function personalizedMV() {
  return request<{
    category: number
    code: number
    result: []
  }>('/personalized/mv')
}

/**
 * 推荐新歌曲
 * @param {number} limit 返回数量限制
 * @returns
 */
export function personalizedSong(limit = 8) {
  return request<{
    category: number
    code: number
    result: {
      id: number
      name: string
      song: Track
    }[]
  }>('/personalized/newsong', { params: { limit } })
}

/**
 * 获取推荐雷达歌单
 * @returns
 */
export async function personalizedRadar() {
  const fns = RADARPLAYLISTS.map((playlist) => {
    return request<{
      code: number
      playlist: Playlist
      privileges: []
    }>('/playlist/detail', { params: { id: playlist.id } })
  })
  const result = await Promise.all(fns)
  return result.map(i => i.playlist)
}

/**
 * 推荐播客
 */
export function personalizedPodcast() {
  return request<{
    code: number
    data: Podcast[]
  }>('/dj/personalize/recommend')
}
