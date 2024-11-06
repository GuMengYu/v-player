import { enqueueSnackbar } from 'notistack'

import type { Tags } from '@shared/types'
import { getSongDownloadUrl } from '@/api/song'
import { QUALITY_LEVEL, useSettingStore } from '@/store/setting'
import type { Track } from '@/types'
import { downloadFile, sizeOfImage } from '@/util/fn'
import is from '@/util/is'

export async function download(url: string, fileName?: string) {
    downloadFile(url, fileName)
}

export async function downloadMusic(track: Track) {
  const quality = useSettingStore.getState().quality
  const br = {
    [QUALITY_LEVEL.STANDARD]: 128000,
    [QUALITY_LEVEL.HIGHER]: 320000,
    [QUALITY_LEVEL.EXHIGH]: 999000,
    [QUALITY_LEVEL.LOSSLESS]: 999000,
    [QUALITY_LEVEL.HIRES]: 999000,
    [QUALITY_LEVEL.SKY]: 999000,
    [QUALITY_LEVEL.JYMASTER]: 999000,
    [QUALITY_LEVEL.JYEFFECT]: 999000,
  }[quality]
  try {
    enqueueSnackbar(`开始下载歌曲${track.name}`, { variant: 'info' })

    const { data } = await getSongDownloadUrl({ id: track.id, br })
    const artistName = track.ar?.map(i => i.name)?.join(',')
    const fileName = `${artistName} - ${track.name}.${data.type}`
    const year = track.publishTime ? new Date(track.publishTime).getFullYear().toString() : ''
    if (!data.url) {
      enqueueSnackbar('未获取到歌曲下载链接', { variant: 'warning' })
      return
    }
    if (is.electron()) {
      const tags: Tags = {
        title: track.name,
        artist: track.ar?.[0].name,
        album: track.al?.name,
        TRCK: track.no,
        year,
        cover: sizeOfImage(track.al?.picUrl),
      }
    }
    else {
      downloadFile(data.url, fileName)
    }
  }
  catch (e) {
    enqueueSnackbar('出现错误，稍后再试', { variant: 'error' })
  }
}
