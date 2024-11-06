import { now } from 'lodash'

import type { Podcast, Program } from '@/types'
import { request } from '@/util/fetch'

/**
 * 推荐电台
 */
export function recommendPodcast() {
  return request<{
    djRadios: Podcast[]
  }>('/dj/recommend')
}

/**
 * 热门电台
 */
export function hotPodcast() {
  return request('/dj/hot')
}

/**
 * 电台分类
 */
export function podcastCats() {
  return request<{
    code: number
    categories: []
  }>('/dj/catelist')
}

/**
 * 分类推荐电台 (优秀新电台)
 * @param type
 */
export function catNewRecommend(type: number) {
  return request<{
    code: number
    hasMore: boolean
    djRadios: Podcast[]
  }>('/dj/recommend/type', {
    params: {
      type,
    },
  })
}

/**
 * 类别下的热门电台
 * @param cateId
 * @param limit
 * @param offset
 */
export function catHots(cateId: number, limit = 30, offset = 0) {
  return request<{
    code: number
    count: number
    hasMore: boolean
    djRadios: Podcast[]
  }>('/dj/radio/hot', {
    params: {
      cateId,
      limit,
      offset,
    },
  })
}

/**
 * 订阅电台
 * @param rid
 * @param t
 */
export function subPodcast(rid: number, t = 1) {
  return request<{
    code: number
    message: string
  }>('/dj/sub', {
    params: {
      rid,
      t,
      timestamp: now(),
    },
  })
}

/**
 * 今日优选播客
 */
export function todayPodcast() {
  return request('/dj/today/perfered')
}

/**
 * 播客详情
 */
export function podcastDetail(rid: number, realTime = false) {
  const params: {
    rid: number
    timestamp?: number
  } = { rid }
  realTime && (params.timestamp = now())
  return request<{
    code: number
    data: Podcast
  }>('/dj/detail', {
    params,
  })
}

/**
 * 播客节目列表
 */
export function podcastPrograms(rid: number, offset = 0, limit = 30, asc = false) {
  return request<{
    code: number
    count: number
    more: boolean
    programs: Program[]
  }>('/dj/program', {
    params: {
      rid,
      offset,
      limit,
      asc,
      timestamp: now(),
    },
  })
}

/**
 * 节目详情
 * @param id
 */
export function getProgramData(id: number) {
  return request<{
    code: number
    program: Program
  }>('/dj/program/detail', {
    params: {
      id,
      timestamp: now(),
    },
  })
}

export function recommendCatAndPodcast() {
  return request<{
    code: number
    data: {
      categoryId: number
      categoryName: string
      radios: Podcast[]
    }[]
  }>('dj/category/recommend')
}
