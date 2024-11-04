import { requestPost } from '@/util/fetch'

function getFidName(fid: number) {
  const map: Record<number, string> = {
    1: 'user',
    2: 'artist',
    13: 'list',
    17: 'dj',
    18: 'song',
    19: 'album',
    21: 'mv',
    31: 'toplist',
    32: 'search',
    33: 'search',
    34: 'event',
    35: 'msg',
  }
  return map[fid]
}
export function playAction(id: number,
  time: number,
  source: { fid: number; fdata: any },
  endType: 'ui' | 'playend' | 'interrupt' | 'exception',
  type: string) {
  const payload: Record<string, any> = {
    type: type || 'song',
    wifi: 0,
    download: 0,
  }
  payload.id = id
  payload.end = endType ?? ''
  payload.time = Math.round(time)
  if (source && source.fid) {
    payload.source = getFidName(source.fid)
    payload.sourceId = source.fdata
  }
  return weblog('play', payload)
}

export function weblog(action: string, json: any) {
  return requestPost('/weblog', {
    log: JSON.stringify({ action, json }),
  })
}
