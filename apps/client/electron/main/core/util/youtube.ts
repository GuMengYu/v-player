// @credit https://github.com/qier222/YesPlayMusic/blob/new-design/packages/desktop/main/youtube.ts
import type { AxiosProxyConfig } from 'axios'
import { HttpProxyAgent } from 'http-proxy-agent'
import ytdl from 'ytdl-core'

import axios from 'axios'
import log from './log'
import { _extractData, _getSearchData, _parseData } from './youtube_scraper'

export interface YoutubeFinderOption {
  proxy: AxiosProxyConfig
}
export interface Result {
  duration: number
  id: string
  title: string
}
class YoutubeFinder {
  options: YoutubeFinderOption
  constructor(options: YoutubeFinderOption) {
    this.options = options
  }

  async search(keyword: string): Promise<Result[]> {
    const config = {
      params: {
        search_query: keyword,
        sp: 'EgIQAQ==',
      },
      headers: { 'Accept-Language': 'en-US' },
      timeout: 6000,
    }
    if (this.options.proxy)
      config['proxy'] = this.options.proxy

    const webPage = await axios.get('https://www.youtube.com/results', config)

    if (webPage.status !== 200)
      return []

    const parsedJson = _getSearchData(webPage.data)
    const extracted = _extractData(parsedJson)
    const parsed = _parseData(extracted)
    return parsed?.videos ?? []
  }

  async matchTrack(
    artist: string,
    name: string,
  ): Promise<{
    url: string
    bitRate: number
    title: string
    videoId: string
    duration: string
    channel: string
  }> {
    const match = async () => {
      const startTime = new Date().getTime()
      const videos = await this.search(`${artist} ${name} audio`)
      const elapsedTime = new Date().getTime() - startTime
      log.info('[youtube]: search', elapsedTime)
      let video: {
        duration: number
        id: string
        title: string
      } | null = null

      if (!video)
        video = videos[0]

      if (!video)
        return null

      const getInfoStartTime = new Date().getTime()
      // todo config proxy
      const proxy = 'http://127.0.0.1:7890'
      const agent = new HttpProxyAgent(proxy)
      const info = await ytdl.getInfo(video.id, {
        requestOptions: { agent },
      })
      const getInfoElapsedTime = new Date().getTime() - getInfoStartTime
      log.info('[youtube ytdl]: getInfo', getInfoElapsedTime)
      if (!info)
        return null
      let url = ''
      let bitRate = 0
      info.formats.forEach((video) => {
        if (video.mimeType === 'audio/webm; codecs="opus"' && video.bitrate && video.bitrate > bitRate) {
          url = video.url
          bitRate = video.bitrate
        }
      })
      const data = {
        url,
        bitRate,
        title: info.videoDetails.title,
        videoId: info.videoDetails.videoId,
        duration: info.videoDetails.lengthSeconds,
        channel: info.videoDetails.ownerChannelName,
      }
      log.info('[youtube] matched ', data)
      return data
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => reject(Error('youtube match timeout')), 10000)
      try {
        match().then((result) => {
          if (result)
            resolve(result)
        })
      }
      catch (e) {
        log.error('[youtube] matchTrack error', e)
        reject(e)
      }
    })
  }
}

export default YoutubeFinder
