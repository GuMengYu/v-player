import { now } from 'lodash'

import { useUserStore } from '@/store/user'
import type { Album, Artist, MV, Playlist, Podcast, Track } from '@/types'
import { request } from '@/util/fetch'

/**
 * 获取用户收藏歌单
 * @param params
 */
export function getUserPlaylist(params = {}) {
  return request<{
    playlist: Playlist[]
  }>('/user/playlist', {
    params: {
      ...params,
      timestamp: now(),
    },
  })
}

/**
 * 获取收藏的专辑
 */
export function favAlbums(offset = 0) {
  return request<{
    code: number
    data: Album[]
    count: number
    hasMore: boolean
  }>('/album/sublist', { params: { timestamp: now(), offset, limit: 50 } })
}

/**
 * 获取收藏的MV
 */
export function favMVs(offset = 0) {
  return request<{
    count: number
    hasMore: boolean
    data: MV[]
  }>('/mv/sublist', { params: { timestamp: now(), offset, limit: 50 } })
}
/**
 * 获取收藏的歌手
 */
export function favArtists(offset = 0) {
  return request<{
    count: number
    hasMore: boolean
    data: Artist[]
  }>('/artist/sublist', { params: { timestamp: now(), offset, limit: 50 } })
}

export function favPodcast(offset = 0) {
  return request<{
    count: number
    hasMore: boolean
    djRadios: Podcast[]
  }>('/dj/sublist', { params: { timestamp: now(), offset, limit: 50 } })
}
/**
 * 获取最近播放
 * @param limit
 * @param type
 */
export function recent(type = 'song', limit = 50) {
  return request<{
    data: {
      list: []
    }
  }>(`/record/recent/${type}`, {
    params: {
      limit,
      timestamp: now(),
    },
  })
}

/**
 * 私人fm
 */

export function personalFM() {
  return request<{
    data: Track[]
  }>('/personal_fm', { params: { timestamp: now() } })
}

/**
 * 私人fm 不喜欢
 */
export const fmToTrash = (id: number) => request('/fm_trash', { params: { id } })

/**
 * 获取推荐歌单（需要登录）
 */
export function recommendPlaylist() {
  return request<{
    recommend: Playlist[]
    featureFirst: boolean
  }>('/recommend/resource')
}

/**
 * 日推-不喜欢
 */
export function dailyRecommendDislike(id: number) {
  return request<{
    code: number
    data: Track
    message: string
  }>('/recommend/dislike', { params: { timestamp: now(), id } })
}

/**
 * 用户日推歌曲
 * @returns
 */
export function getDailyRecommend() {
  return request<{
    data: {
      dailySongs: Track[]
      recommendReasons: []
    }
  }>('/recommend/songs', { params: { timestamp: now() } })
}

/**
 * 获取喜欢列表
 */
export function getLikeList() {
  return request<{
    ids: number[]
    code: number
  }>(`/likelist?timestamp=${now()}`)
}

export async function getHeartBeatList(id: number) {
  const favorites = useUserStore().getFavs()
  const res = await request<{
    code: number
    data: Array<{
      id: number
      songInfo: Track
      recommended: boolean
    }>
  }>('/playmode/intelligence/list', {
    params: {
      id,
      pid: favorites.id,
    },
  })
  if (res.code === 200)
    return res.data.map(i => i.songInfo)
  else
    return []
}

export interface PlayRecord {
  playCount: number
  score: number
  song: Track
}

/**
 * 获取听歌排行
 */
export async function fetchPlayRecord(uid: string | number) {
  const fetch = (type = 0) =>
    request<{
      code: number
      weekData?: Array<PlayRecord>
      allData?: Array<PlayRecord>
    }>('/user/record', {
      params: {
        uid,
        timestamp: now(),
        type,
      },
    })
  const [weekData, allData] = await Promise.all([fetch(1), fetch(0)])
  return {
    weekData: weekData.weekData ?? [],
    allData: allData.allData ?? [],
  }
}
