import { Howl, Howler } from 'howler'

import cloneDeep from 'lodash/cloneDeep'
import { enqueueSnackbar } from 'notistack'
import { end, start } from '@/api/music'
import type { Program, Track, TrackFrom, listType } from '@/types'
import { sleep, toHttps } from '@/util/fn'
import { PLAY_MODE, usePlayerStore } from '@/store/player'
import { playQueueStore } from '@/store/playQueue'
import { PipLyric } from '@/util/pipLyric'
import { useSettingStore } from '@/store/setting'
import { fetchTrack } from '@/api/query/useTrack'

// const messages = {
//   zhCN: {
//     message: {
//       can_not_play: '播放失败, 将自动播放下一曲',
//       loadFail: '歌曲加载失败，跳过或稍后再试试哦 🥲',
//     },
//   },
//   en: {
//     message: {
//       can_not_play: 'Can not play, will play next automatically',
//       loadFail: 'Load failed, skip or try again later 🥲',
//     },
//   },
// }
// export interface PlayerInstance {
//   updatePlayerTrack: (
//     trackId: Track['id'],
//     autoPlay?: boolean,
//     resetProgress?: boolean,
//     isFm?: boolean,
//     from?: TrackFrom
//   ) => void
//   pause: () => void
//   play: () => void
//   next: () => void
//   prev: () => void
//   togglePlay: () => void
//   setSeek: (seek: number) => void
//   setoutputDevice: () => void
// }
export interface PipLyricInstance {
  enter: () => void
  onLeave: () => void
  onEnter: () => void
  leave: () => void
  setData: (trac: Track, lyric: Track['lyric']) => void
  pause: () => void
  play: () => void
  updateTime: (time: number) => void
}

export class Player {
  howler: null | Howl
  track: null | Track
  volume: number
  private currentTime: number
  playing: boolean
  private progressInterval: ReturnType<typeof setInterval> | undefined
  private isCurrentFm: boolean
  pipLyric: null | PipLyricInstance
  html5: boolean
  taskbarProgress?: boolean
  nextLoaded: boolean
  constructor() {
    this.howler = null
    this.pipLyric = null
    this.html5 = true

    const { track, playing, volume = 0.8, currentTime, isCurrentFm } = usePlayerStore.getState()
    // this.track = track
    if (track?.id)
      this.track = track
    else
      this.track = null
    this.setVolume(volume)
    this.currentTime = currentTime
    this.playing = playing
    this.isCurrentFm = isCurrentFm
    this.init()
    this.nextLoaded = false
  }

  private init() {
    const style = 'color: tomato; -webkit-text-stroke: 1px black; font-size:20px;'
    console.log('%c Start initializing the player 😆', style)
    this.initStoreEvent()
    this.initPip()
    if (this.track?.id)
      this.updatePlayerTrack(this.track.id, false, false, false, this.track.source?.from)
  }

  initPip() {
    this.pipLyric = PipLyric()() as any
    this.pipLyric.onLeave = () => {
      usePlayerStore.setState({
        showPipLyric: false,
      })
    }
    this.pipLyric.onEnter = () => {
      usePlayerStore.setState({
        showPipLyric: true,
      })
    }
  }

  private initStoreEvent() {
    usePlayerStore.subscribe(state => [state.volume, state.isCurrentFm], (state, prev) => {
      const [volume, isCurrentFm] = state
      const [prevVolume, prevIsCurrentFm] = prev
      if (prevVolume !== volume) {
        this.volume = <number>volume
        this.howler?.volume(<number>volume)
        Howler.volume(<number>volume)
      }
      if (prevIsCurrentFm !== isCurrentFm)
        this.isCurrentFm = <boolean>isCurrentFm
    })
  }

  /**
   * 播放指定歌曲
   * @param trackId 歌曲id
   * @param autoplay 立即播放（true）
   * @param resetProgress 重置进度条（true）
   * @param isFm
   * @param from
   */
  async updatePlayerTrack(trackId: number, autoplay = true, resetProgress = true, isFm = false, from?: TrackFrom) {
    if (!trackId)
      return
    usePlayerStore.setState({ loadingTrack: true })
    try {
      const { track, trackMeta, lyric } = await fetchTrack(trackId, from)
      // restore common mode
      if (!isFm)
        usePlayerStore.setState({ isCurrentFm: false })

      if (trackMeta.url) {
        if (lyric)
          track.lyric = lyric // 存入歌词

        // update track source
        if (from)
          mixinTrackSource(track, from)

        track.meta = trackMeta
        // 保存到 store
        usePlayerStore.setState({
          track,
        })
        if (resetProgress)
          this.updateCurrentTime(0)

        this.track = track
        Howler.unload()
        this.howler?.unload()
        this.howler = null
        const url = trackMeta.sourceFromUnlockMusic ? trackMeta.url : toHttps(trackMeta.url)
        this.howler = this.initSound(url)
        this.initMediaSession(track)
        if (resetProgress)
          this.setSeek(0)
        else
          this.setSeek(this.currentTime)

        if (autoplay) {
          this.play()
          if (from.type !== 'local')
            await start({ id: this.track.id })
        }
        else {
          this.pause()
        }
        this.nextLoaded = false
        // if (from === 'online' && cacheLimit) {
        //     // 延迟请求buffer缓存 防止阻塞后面播放的url请求
        //     await sleep(500);
        //     playerIDB.cacheTrack(trackInfo, cacheLimit);
        // }
      }
      else {
        enqueueSnackbar({ message: `${track?.name} 无法播放, 将播放下一首`, variant: 'error' })
        // toast.error(track?.name + this.t('message.can_not_play'))
        await sleep(500)
        this.next()
      }
      this.setOutPutDevice()
    }
    catch (e) {
      // stop loading
      this.trackLoaded()
    }
  }

  private initSound(src: string) {
    Howler.autoUnlock = false
    Howler.usingWebAudio = true
    const sound = new Howl({
      volume: this.volume,
      src,
      html5: true, // web audio 用 xhr 方式拉取音频，解锁音乐可能会存在跨域，强制 html5 加载
      preload: 'metadata',
      format: ['mp3', 'flac'],
      onplay: () => {
        this.pauseProgress()
        this.setProgressInterval()
      },
      onplayerror: () => {
        enqueueSnackbar({ message: `${this.track?.name} 播放失败`, variant: 'error' })
      },
      onseek: () => {
        // do noting
      },
      onload: () => {
        this.trackLoaded()
        if (this.track) {
          const { name, ar = [] } = this.track
          const artists = ar.map(a => a.name).join('&')
          // global window
          document.title = `${name} - ${artists}`
          this.fixDuration()
          if (this.pipLyric && this.track?.source?.fromType !== 'local')
            this.pipLyric.setData(this.track, this.track.lyric)

          // this.pipLyric.enter()
        }
      },
      onloaderror: (e) => {
        console.log(e)
        this.trackLoaded()
        enqueueSnackbar({ message: `${this.track?.name} 加载失败`, variant: 'error' })
      },
    })
    sound.once('end', this.endCb.bind(this))
    sound.seek(0)
    return sound
  }

  // 修正歌曲时长，当实际获取的音源时长，与网易返回的音源时长相差超过1s, 则修正为实际的音源时长
  private fixDuration() {
    const duration = this.howler?.duration() ?? 0
    const factDuration = duration * 1000
    const trackDuration = this.track?.dt ?? 0
    const offset = factDuration - trackDuration
    if (offset > 1000 || offset < -1000) {
      console.log(
        `net ease返回的歌曲长度: ${this.track?.dt}， 歌曲实际长度: ${duration * 1000}， 偏差大小: ${offset}，修正`,
      )
      const storeTrack = usePlayerStore.getState().track
      if (storeTrack?.id) {
        usePlayerStore.setState({
          track: {
            ...storeTrack,
            dt: factDuration,
          },
        })
      }
    }
  }

  private trackLoaded() {
    usePlayerStore.setState({ loadingTrack: false })
    // this.store.$state.loadingTrack = false
  }

  pause() {
    usePlayerStore.setState({ playing: false })
    this.howler?.fade(this.volume, 0, 200)
    this.playing = false
    this.howler?.once('fade', () => {
      this.howler?.pause()
      this.pipLyric?.pause()
    })
  }

  play() {
    if (this.howler?.playing())
      return
    usePlayerStore.setState({ playing: true })
    this.howler?.play()
    this.howler?.once('play', () => {
      this.playing = true
      this.howler?.fade(0, this.volume, 200)
      this.pipLyric?.play()
    })
  }

  togglePlay() {
    if (this.howler?.playing())
      this.pause()
    else
      this.play()
  }

  replay() {
    this.howler?.seek(0)
    this.howler?.play()
  }

  load() {
    const track = playQueueStore.getState().popTrack()
    if (track)
      this.updatePlayerTrack(track.id, true, true, false, track.source?.from)

  }

  next() {
    const { playMode } = usePlayerStore.getState()
    if (playMode === PLAY_MODE.REPEAT_ONCE) {
      this.replay()
      return
    }
    const track = playQueueStore.getState().popNextTrack()
    if (track)
      this.updatePlayerTrack(track.id, true, true, false, track.source?.from)
    else
      enqueueSnackbar('往后没有更多可播放的音乐了', { variant: 'info' })
  }

  async nextFm() {
    const { isCurrentFm, updatePersonalFmList } = usePlayerStore.getState()

    if (!isCurrentFm)
      usePlayerStore.setState({ isCurrentFm: true })

    const track = await updatePersonalFmList()
    if (track?.id)
      await this.updatePlayerTrack(track.id, true, true, true)
  }

  prev() {
    const { playMode } = usePlayerStore.getState()

    if (playMode === PLAY_MODE.REPEAT_ONCE) {
      this.replay()
      return
    }
    // 当前播放歌曲超过 30s，点击上一曲倒退回初始
    if (this.howler!.seek() > 30) {
      this.replay()
      return
    }
    const track = playQueueStore.getState().popPrevTrack()
    if (track && track.id)
      this.updatePlayerTrack(track.id, true, true, false, track?.source?.from)
    else
      enqueueSnackbar('往前没有更多可播放的音乐了', { variant: 'info' })
  }


  private nextTrack() {
    return playQueueStore.getState().popNextTrack()
  }

  private prevTrack() {
    return playQueueStore.getState().popPrevTrack()
  }

  updateCurrentTime(this: Player, val?: number) {
    const current = val ?? Math.ceil(this.howler?.seek() || this.currentTime)
    this.currentTime = current
    usePlayerStore.setState({
      currentTime: current,
    })
    // this.store.currentTime = current
    this.pipLyric?.updateTime(current)
    this.onPlaying(current)
    // if (this.taskbarProgress && this.track?.dt) {
    //   const p = current / (this.track.dt / 1000)
    //   const progress = p >= 1 ? 1 : p
    // }
  }

  async onPlaying(current: number) {
    if (this.track?.dt) {
      const remaining = this.track.dt / 1000 - current
      // 剩余30秒，预加载下一首
      if (remaining < 30 && !this.nextLoaded) {
        const track = playQueueStore.getState().getNextTrack()
        console.log('load next track', track)

        if (track)
          await fetchTrack(track.id, track.source?.from)

        this.nextLoaded = true

      }


    }
  }

  setSeek(val: number) {
    this.howler?.seek(val)
    this.updateCurrentTime()
  }

  setVolume(volume: number) {
    this.volume = volume
    Howler.volume(this.volume)
    usePlayerStore.setState({ volume: this.volume })
  }

  pauseProgress() {
    clearTimeout(this.progressInterval)
    this.progressInterval = undefined
  }

  restoreProgress() {
    this.setProgressInterval()
  }

  setOutPutDevice(deviceId?: string) {
    const outputdevice = deviceId ?? useSettingStore.getState().outputdevice
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (this.howler?._sounds.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const soundNode = this.howler._sounds[0]._node
      if (outputdevice && soundNode?.setSinkId)
        soundNode.setSinkId(outputdevice)
    }
  }

  private setProgressInterval(this: Player) {
    this.progressInterval = setTimeout(() => {
      if (this.howler?.playing() && this.progressInterval) {
        this.updateCurrentTime()
        this.setProgressInterval()
      }
    }, 1000)
  }

  private endCb() {
    if (usePlayerStore.getState().isCurrentFm)
      this.nextFm()
    else
      this.next()

    if (this.track && this.track.source?.fromType !== 'local')
      this.endPlay(this.track, 0, true)
  }

  // 播放完毕打卡
  private async endPlay(track: Track, time: number, played = false) {
    const { id, dt = 0 } = track

    const sourceId = track.source?.from?.id
    if (played)
      time = +dt / 1000

    if (time) {
      console.log('歌曲打卡', this.track?.name, Math.ceil(time), played)
      try {
        await end({
          id,
          sourceId: sourceId || '',
          time: Math.ceil(time),
        })
      }
      catch (e) {
        console.log('打卡失败', e)
      }
    }
  }

  private initMediaSession(track: Track) {
    // https://developers.google.com/web/updates/2017/02/media-session
    if ('mediaSession' in navigator) {
      const { ar: artist, al: album, name: title } = track
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: artist?.map(a => a.name).join('&'),
        album: album?.name ?? '',
        artwork: [
          {
            src: album?.picUrl ?? '',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      })
      ;[
        ['play', this.togglePlay],
        ['pause', this.togglePlay],
        ['previoustrack', this.prev],
        ['nexttrack', this.next],
      ].forEach((ac) => {
        const [action, handler] = ac as ['string', () => void]
        navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler.bind(this))
      })
    }
  }
}

export const createPlayer = () => new Player()

export function mixinTrackSource(track: Track | Program, from: TrackFrom) {
  const url = {
    album: `/album/${from.id}`,
    playlist: `/playlist/${from.id}`,
    artist: `/artist/${from.id}`,
    daily: '/daily',
    cloud: '/cloud',
    recent: '/recent',
    intelligence: '',
    program: `/podcast/${from.id}`,
    unknown: '',
    local: '/local',
    rank: '/rank',
    search: `/search?keyword=${from.id}`,
  }[from.type as listType]
  track.source = {
    fromUrl: url,
    fromType: from.type,
    fid: from.type,
    fdata: from.id,
    from,
    fromName: from.name,
  }
  if (from.type === 'program')
    track.program = cloneDeep(track) as Program
}
