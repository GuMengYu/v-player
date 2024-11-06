import type { MV, Playlist } from '@/types'
import { request } from '@/util/fetch'

/**
 * top歌手
 * @returns
 */
export const topArtists = () => request('/toplist/artist?type=2')
/**
 * 获取网友精选碟歌单
 * 可选参数 : order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 cat:cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 limit: 取出歌单数量 , 默认为 50
 offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 */
export function getTopPlaylist(params = { limit: 20, cat: '全部', offset: 0 }) {
  return request<{
    playlists: Playlist[]
  }>('/top/playlist', { params })
}

export function getTopPlaylistHighQuality(params = { limit: 20, cat: '全部' }) {
  return request<{
    playlists: Playlist[]
  }>('/top/playlist/highquality', { params })
}

/**
 * 新歌
 * @returns {AxiosPromise}
 */
export function topSongs() {
  return request('/top/songs', {
    params: {
      limit: 20,
      area: 'ALL',
      type: 'hot',
    },
  })
}

/**
 * mv排行
 * @returns {AxiosPromise}
 */
export function topMvs() {
  return request<{
    data: MV[]
    hasMore: boolean
  }>('/top/mv', {
    params: {
      limit: 20,
    },
  })
}

/**
 * 获取所有榜单
 */
export function getTopList() {
  return request<{
    list: Playlist[]
  }>('/toplist')
}
