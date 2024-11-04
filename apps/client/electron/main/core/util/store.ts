import Store from 'electron-store'

import log from './log'

log.info('[main] init store')

export interface StoreType {
  windowSize: {
    width: number
    height: number
  }
  youtube: {
    open: boolean
    proxy: string
  }
  windowPosition: any
}

const store = new Store<StoreType>({
  defaults: {
    windowSize: {
      height: 670,
      width: 1000,
    },
    windowPosition: null,
    youtube: {
      open: false,
      proxy: 'http://127.0.0.1:7890',
    },
  },
})

export default store
