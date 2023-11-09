import { now } from '@/util/fn'

import type { Album, Track } from '@/types'
import { request } from '@/util/fetch'

/**
 * 获取专辑详情
 * @param {number} id
 * 根据专辑id返回专辑详细信息
 * @returns {Promise<Album>}
 */

export function getAlbum(id: number) {
  return request<{
    album: Album
    songs: Track[]
    resourceState: boolean
  }>('/album', { params: { id } })
}

/**
 * 获取新专辑
 */
export function newAlbums(params?: { limit?: number; area?: string }) {
  return request<{
    code: number
    albums: Album[]
  }>('/album/new', {
    params,
  })
}

/**
 * 获得专辑动态信息,如是否收藏,收藏数,评论数,分享数
 * @param id
 */
export function getAlbumDynamic(id: number) {
  return request<{
    isSub: boolean
    onSale: boolean
    likedCount: number
    subCount: number
  }>('/album/detail/dynamic', {
    params: {
      timestamp: now(),
      id,
    },
  })
}

/**
 * 获取专辑评论
 * @param id
 * @param limit
 * @param offset
 * @returns
 */
export function getAlbumComment(id: number, limit = 15, offset = 0) {
  return request<{
    code: number
    total: number
    comments: []
    hotComments: []
    more: boolean
    hotMore: boolean
  }>('/comment/album', { params: { id, limit, offset } })
}
