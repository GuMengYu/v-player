import  pick  from 'lodash/pick'
import  random  from 'lodash/random'
import  shuffle  from 'lodash/shuffle'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Program, SimpleTrack, Track, TrackFrom, listType } from '@/types'
import { mixinTrackSource } from '@/player/base'
import { PLAY_MODE, usePlayerStore } from '@/store/player'

export interface PlayQueueState {
  queue: {
    id?: number
    type?: listType
    name?: string
    sequence: SimpleTrack[]
    states: SimpleTrack[]
    tracks: Track[]
  }
  index: number
}

export interface PlayQueueAction {
  updatePlayQueue: (id: number, type: listType, name: string, data: Track[]) => void
  clearQueue: () => void
  addToPlayQueue: (track: Track | Program, from?: TrackFrom, afterCurrent?: boolean) => number
  addToPlayQueueBatch: (tracks: Track[] | Program[], from?: TrackFrom, afterCurrent?: boolean) => number
  removeFromQueue: (trackId: number) => void
  shuffle: () => void
  unShuffle: () => void
  popNextTrack: () => SimpleTrack | Track | null | undefined
  popPrevTrack: () => SimpleTrack | null | undefined
  getPrevTrack: () => SimpleTrack | null | undefined
  getNextTrack: () => SimpleTrack | null | undefined
  popTrack: () => SimpleTrack | null | undefined
  setIndex: (index: number) => void
}

export const playQueueStore = create(persist<PlayQueueState & PlayQueueAction>((set, get) => {
  return {
    queue: {
      sequence: [],
      states: [],
      tracks: [],
    },
    index: -1,
    // actions
    setIndex: index => set({ index }),
    /**
     * 更新播放列表
     * @param id 队列id
     * @param type 队列类型-专辑/歌单/歌手热门/智能列表/电台节目单
     * @param name 队列名
     * @param data 队列数据
     */
    updatePlayQueue(id: number, type: listType, name: string, data: Track[]) {
      data.forEach((i) => {
        // 混入队列信息
        mixinTrackSource(i, { type, id, name })
      })
      // 精简track, 只在store存储必要的信息
      const tracks = simpleTracks(data)
      set({
        index: -1,
        queue: {
          sequence: [...tracks], // deep copy avoid mutation of sequence and states
          states: [...tracks],
          tracks: data,
        },
      })
    },
    /**
     * 清除队列
     */
    clearQueue() {
      set({
        index: -1,
        queue: {
          sequence: [],
          states: [],
          tracks: [],
        },
      })
    },
    /**
     * 添加歌曲到播放队列
     * @param track 歌曲
     * @param from 来源
     * @param afterCurrent 是否插入到播放位置后
     * @return number 插入位置
     */
    addToPlayQueue(track: Track | Program, from?: TrackFrom, afterCurrent?: boolean) {
      if (from)
        mixinTrackSource(track, from)
      const { queue, index } = get()
      const [_track] = simpleTracks([track])
      const { track: currentTrack } = usePlayerStore.getState()
      const list = queue.sequence
      // 已存在
      const existIndex = list.findIndex(i => i.id === track.id)
      if (existIndex >= 0) {
        // 移动到正在播放的后面
        if (afterCurrent) {
          // 本身不需要移动
          if (existIndex === index) {
            return existIndex
          }
          // 已存在歌曲在当前歌曲后，先删除再添加到目标位置后
          else if (existIndex > index) {
            const [deleted] = list.splice(existIndex, 1)
            list.splice(index + 1, 0, deleted)
            set(state => ({ queue: { ...state.queue, sequence: list } }))
            return index + 1
          }
          // 已存在歌曲在当前歌曲前，先删除再添加到目标位置后
          else {
            const [deleted] = list.splice(existIndex, 1)
            list.splice(index, 0, deleted)
            set(state => ({ queue: { ...state.queue, sequence: list } }))
            return index
          }
        }
        else {
          return existIndex
        }
      }
      else {
        if (afterCurrent) {
          list.splice( index + 1, 0, _track)
          set(state => ({ queue: { ...state.queue, sequence: list } }))
          return index + 1
        }
        else {
          list.push(_track)
          set(state => ({ queue: { ...state.queue, sequence: list } }))
          return list.length - 1 // last track index
        }

      }
    },
    /**
     * 批量添加到播放队列
     * @param tracks
     * @param from
     * @param afterCurrent
     */
    addToPlayQueueBatch(tracks: Track[] | Program[], from?: TrackFrom, afterCurrent?: boolean) {
      if (from) {
        tracks.forEach((track) => {
          mixinTrackSource(track, from)
        })
      }
      const { queue, index } = get()
      const _tracks = simpleTracks(tracks)
      const { track: currentTrack } = usePlayerStore.getState()
      const list = queue.sequence
      // 过滤
      const filteredTracks = _tracks.filter(track => !list.some(i => i.id === track.id))
      if (afterCurrent) {
        list.splice( index + 1, 0, ...filteredTracks)
        set(state => ({ queue: { ...state.queue, sequence: list } }))
        return index + 1
      }
      else {
        list.push(...filteredTracks)
        set(state => ({ queue: { ...state.queue, sequence: list } }))
        return list.length - 1 // last track index
      }
    },

    /*
     * 从队列中删除
     * @param trackId
     * @returns
     */
    removeFromQueue(trackId: number) {
      const list = get().queue.sequence
      if (list?.length) {
        const index = list.findIndex(item => item.id === trackId)
        list.splice(index, 1)
        set(state => ({
          queue: {
            ...state.queue,
            sequence: list,
          },
        }))
      }
    },
    /**
     * 随机队列
     */
    shuffle() {
      const queue = get().queue
      const shuffled = shuffle(queue.sequence)
      const len = queue.states.length
      set(state => ({
        queue: {
          ...state.queue,
          sequence: shuffled,
          states: shuffled.slice(shuffled.length - len),
        },
      }))
    },
    /**
     * 恢复队列
     */
    unShuffle() {
      const queue = get().queue
      const len = queue.states.length
      const tracks = simpleTracks(queue.tracks)
      set(state => ({
        queue: {
          ...state.queue,
          sequence: tracks,
          states: tracks.slice(tracks.length - len),
        },
      }))
    },
    popNextTrack() {
      const { playMode, shuffle } = usePlayerStore.getState()
      const { queue, index } = get()

      // 无效索引
      if (index > queue.sequence.length - 1)
        return

      if (shuffle) {
        const randomIndex = random(0, queue.sequence.length - 1)
        set({
          index: randomIndex,
        })
      }
      else {
        // last one
        if (index === queue.sequence.length - 1 ) {
          if (playMode === PLAY_MODE.NORMAL) {
            return
          }
          else if (playMode === PLAY_MODE.REPEAT) {
            set(state => ({
              index: 0,
            }))
          }
        }
        else {
          set(state => ({
            index: index + 1,
          }))
        }
      }


      const nextIndex = get().index
      return queue.sequence[nextIndex]
    },
    getNextTrack() {
      const { playMode, shuffle } = usePlayerStore.getState()
      const { queue, index } = get()
      let nextIndex = index

      // 无效索引
      if (index > queue.sequence.length - 1)
        return

      if (shuffle) {
        return
      }
      else {
        // last one
        if (index === queue.sequence.length - 1 ) {
          if (playMode === PLAY_MODE.NORMAL)
            return

          else if (playMode === PLAY_MODE.REPEAT)
            nextIndex = 0
        }
        else {
          nextIndex = index + 1
        }
      }
      return queue.sequence[nextIndex]
    },
    getPrevTrack() {
      const { index, queue } = get()
      // 无效索引或处于第一
      if (index <= 0) {
        return null
      }
      else {
        const prevIndex = index - 1
        return queue.sequence[prevIndex]
      }
    },
    popPrevTrack() {
      const { index, queue } = get()
      const sequence = queue.sequence
      // 无效索引或处于第一
      if (index <= 0) {
        return null
      }
      else {
        // // 往前移动一首，取回前一首放到队列开头, 并返回前一首id
        // const prev = sequence[sequence.length - playQueue.queue.states.length - 1]
        // const prev2 = sequence[sequence.length - playQueue.queue.states.length - 2]
        const prevIndex = index - 1
        set({
          index: prevIndex,
        })
        return queue.sequence[prevIndex]

        // if (prev2) {
        //   set(state => ({
        //     queue: {
        //       ...state.queue,
        //       states: [prev, ...state.queue.states],
        //     },
        //   }))
        //   return prev2
        // }
        // else {
        //   return null
        // }
      }
    },
    popTrack() {
      const { index, queue } = get()
      if (index >= 0 && index <= queue.sequence.length)
        return queue.sequence[index]

    },
  }
}, {
  name: 'playQueue',
  storage: createJSONStorage(() => localStorage),
}))

function simpleTracks(tracks: Track[]) {
  return tracks.map(track => pick(track, ['id', 'name', 'source', 'al', 'ar', 'radio']) as any as SimpleTrack)
}
