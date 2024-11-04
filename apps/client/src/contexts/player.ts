import { createContext } from 'react'
import { createPlayer } from '@/player/base'

export const player = createPlayer()
export const PlayerContext = createContext(player)
export const PlayerProvider = PlayerContext.Provider
