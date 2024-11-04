// @credit https://www.npmjs.com/package/@yimura/scraper

export function _parseData(data) {
  const results: {
    channels: []
    playlists: []
    streams: []
    videos: {
      duration: number
      id: any
      title: any
    }[]
  } = {
    channels: [],
    playlists: [],
    streams: [],
    videos: [],
  }

  const isVideo = item => item.videoRenderer && item.videoRenderer.lengthText
  const getVideoData = (item) => {
    const vRender = item.videoRenderer
    const compress = (key) => {
      return (key && key['runs'] ? key['runs'].map(v => v.text) : []).join('')
    }
    const parseDuration = (vRender) => {
      if (!vRender.lengthText?.simpleText)
        return 0

      const nums = vRender.lengthText.simpleText.split(':')
      const time = nums.reduce((a, t) => 60 * a + +t) * 1e3

      return time
    }

    return {
      duration: parseDuration(vRender),
      id: vRender.videoId,
      title: compress(vRender.title),
    }
  }

  for (const item of data) {
    if (isVideo(item))
      results.videos.push(getVideoData(item))
  }

  return results
}

export function _extractData(json) {
  json = json.contents.twoColumnSearchResultsRenderer.primaryContents

  let contents = []

  if (json.sectionListRenderer) {
    contents = json.sectionListRenderer.contents
      .filter(item =>
        item?.itemSectionRenderer?.contents.filter(x => x.videoRenderer || x.playlistRenderer || x.channelRenderer),
      )
      .shift().itemSectionRenderer.contents
  }

  if (json.richGridRenderer) {
    contents = json.richGridRenderer.contents
      .filter(item => item.richItemRenderer && item.richItemRenderer.content)
      .map(item => item.richItemRenderer.content)
  }

  return contents
}

export function _getSearchData(webPage: string) {
  const startString = 'var ytInitialData = '
  const start = webPage.indexOf(startString)
  const end = webPage.indexOf(';</script>', start)

  const data = webPage.substring(start + startString.length, end)

  try {
    return JSON.parse(data)
  }
  catch (e) {
    throw new Error(
      'Failed to parse YouTube search data. YouTube might have updated their site or no results returned.',
    )
  }
}
