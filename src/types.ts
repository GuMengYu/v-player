export type listType =
  | 'album'
  | 'playlist'
  | 'artist'
  | 'daily'
  | 'cloud'
  | 'intelligence'
  | 'recent'
  | 'program'
  | 'unknown'
  | 'local'
  | 'rank'
  | 'search'
export interface TrackFrom {
  id: number | string
  type: listType
  name: string
}
export interface TrackSource {
  fromUrl: string
  fromType: listType
  from: TrackFrom
  fid: listType
  fdata: number | string
  fromName: string
}
export interface SimpleTrack {
  id: number
  name: string
  source: TrackSource
  al: Track['al']
  ar: Track['ar']
  radio: Track['radio']
}

interface Quality {
  br: number // 码率
  fid: number
  size: number // 大小
  sr: number // 采样率
  vd: number
}
export interface Track {
  id: number
  name: string
  duration?: number
  dt?: number
  ar?: Artist[]
  artists?: Artist[]
  al?: Album
  album?: Album
  no?: number | string
  publishTime?: number
  coverUrl?: string
  h?: Quality
  l?: Quality
  m?: Quality
  sq?: Quality
  hr?: Quality
  meta?: {
    url: null | string
    br?: null | number
    type?: string
    encodeType?: string
    sourceFromUnlockMusic?: boolean
    sourceFromLocalMusic?: boolean
  }
  lyric?: {
    tlyric: {
      lyric: string
    }
    lrc: {
      lyric: string
    }
    yrc: {
      lyric: string
    }
  }
  source?: TrackSource
  program?: Program
  radio?: {
    name: string
    id: number
    picUrl: string
  }
  liked?: boolean
  mainTrackId?: number
  fee?: number
  noCopyrightRcmd?: boolean
}
export interface MV {
  artist?: Artist
  artists?: Artist[]
  id: number
  vid?: string
  name: string
  copywriter: string
  picUrl?: string
  imgurl16v9?: string
  coverUrl?: string
  cover?: string
  playCount: number
  type: number
  canDislike: boolean
  publishTime?: string
  briefDesc?: string
  subed?: boolean
}

export interface Artist {
  id: number
  userId?: number
  name: string
  userName?: string
  img1v1Url?: string
  cover?: string
  picUrl?: string
  albumSize: number
  musicSize?: number
  mvSize?: number
  briefDesc: string
  rank?: {
    rank: number
    type: number
  }
  transNames: string[]
  followed: boolean
  alias: string[]
  identifyTag?: []
  identities?: []
}

export interface Album {
  tracks: Track[]
  id: number
  name: string
  picUrl: string
  coverImgUrl?: string
  artist: Artist
  artists: Artist[]
  description: string
  company: string
  companyId: number
  publishTime: number
  size: number
  songs: Track[]
  subType: string
  type: string
  isSub?: boolean
  subTime?: number
  alias: string[]
}

export interface Playlist {
  id: number
  name: string
  tracks: Track[]
  trackIds: {
    id: number
  }[]
  trackCount: number
  backgroundCoverUrl?: string
  coverImgUrl: string
  picUrl?: string
  createTime: number
  publishTime?: number
  creator: User
  description: string
  englishTitle?: string
  playCount: number
  subscribed: boolean
  subscribedCount?: number
  tags?: string[]
  titleImageUrl: string
  specialType: number
  updateFrequency?: string
  userId?: number
  privacy?: number
  officialPlaylistType?: string
}

export interface Podcast {
  id: number
  dj: User
  name: string
  picUrl: string
  desc: string
  subCount: number
  programCount: number
  createTime: number
  categoryId: number
  category: string
  secondCategoryId: number
  secondCategory: string
  radioFeeType: number
  feeScope: number
  buyed: boolean
  videos: any
  finished: boolean
  underShelf: boolean
  purchaseCount: number
  price: number
  originalPrice: number
  discountPrice: any
  lastProgramCreateTime: number
  lastProgramName: string
  lastProgramId: number
  picId: number
  rcmdText: string
  hightQuality: boolean
  whiteList: boolean
  liveInfo: any
  playCount: number
  icon: any
  privacy: boolean
  intervenePicUrl: string
  intervenePicId: number
  dynamic: boolean
  shortName: any
  taskId: number
  manualTagsDTO: any
  scoreInfoDTO: any
  descPicList: any
  subed: boolean
  composeVideo: boolean
  rcmdtext: string
  lastUpdateProgramName: string
  alg: string
  programs: Program[]
}

interface Voice {
  name: any
  id: number
  size: number
  extension: string
  sr: number
  dfsId: number
  bitrate: number
  playTime: number
  volumeDelta: number
}
export interface Program {
  id: number
  mainSong: {
    id: number
    bMusic: Voice
    lMusic?: Voice
    hMusic?: Voice
  }
  coverUrl: string
  name: string
  duration: number
  liked: boolean
  likedCount: number
  listenerCount: number
  source: TrackSource
  program?: Program
  createTime?: string
}
interface Profile extends User {
  userName: string
  userType: number
  signature: string
}
export interface Account {
  profile: Profile
  account?: {
    vipType: string
    id: number
    userName: string
  }
  vipInfo?: {
    associator: {
      dynamicIconUrl: string
      expireTime: number
      iconUrl: string
      vipLevel: number
      vipCode: number
    }
    redVipDynamicIconUrl: string
    redVipDynamicIconUrl2: string
    redVipLevel: number
    redVipLevelIcon: string
    redVipAnnualCount: number
    redplus?: {
      expireTime: number
      vipLevel: number
      iconUrl: string
    }
  }
  token?: string
}

export interface Tracks {
  id?: string
  list: Track[]
}

export interface Comment {
  commentId: string
  content: string
  richContent: string
  user: User
  time: number
  timeStr: string
}

export interface User {
  defaultAvatar: boolean
  province: number
  authStatus: number
  followed: boolean
  avatarUrl: string
  accountStatus: number
  gender: number
  city: number
  birthday: number
  userId: number
  userType: number
  nickname: string
  signature: string
  description: string
  detailDescription: string
  avatarImgId: number
  backgroundImgId: number
  backgroundUrl: string
  authority: number
  mutual: boolean
  expertTags: any
  experts: any
  djStatus: number
  vipType: number
  remarkName: any
  authenticationTypes: number
  avatarDetail: any
  avatarImgIdStr: string
  backgroundImgIdStr: string
  anchor: boolean
  avatarImgId_str: string
}

export interface Wallpaper {
  id: string
  url: string
  short_url: string
  views: number
  favorites: number
  source: string
  purity: string
  category: string
  dimension_x: number
  dimension_y: number
  resolution: string
  ratio: string
  file_size: number
  file_type: string
  created_at: string
  colors: string[]
  path: string
  thumbs: Thumbs
}

export interface Thumbs {
  large: string
  original: string
  small: string
}

export interface PlayNowEvent {
  id: number
  setQueue: boolean
  from: TrackFrom
}

export interface ContextMenuType {
  target: HTMLElement | null
  cursorPosition: {
    x: number
    y: number
  } | null
  options: {
    useCursorPosition?: boolean
  } | null
}
