import { TrackSource } from '@/types'

export interface Tags {
  title: string
  artist?: string
  album?: string
  composer?: string
  APIC?: string
  TRCK?: string | number
  cover?: string
  year?: string
}

export enum WindowState {
  NORMAL = 'normal',
  MAXIMIZED = 'maximized',
  MINIMIZED = 'minimized',
  CLOSED = 'closed',
  MINIMIZEDTRAY = 'minimizedTray',
}

export interface LocalTrack {
  name: string
  id: number
  url: string
  ar?: { id: number; name: string }[]
  al: {
    name: string
    id: number
  }
  bit: number
  sample: number
  dt: number
  source: TrackSource
}
