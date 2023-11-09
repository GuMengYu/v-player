import dayjs from 'dayjs'
import inRange from 'lodash/inRange'

/**
 * 休眠
 * @param time 暂停程序时长（毫秒）
 */
export function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(time)
    }, time)
  })
}
/**
 * 格式化网易云歌词
 * @param lyric
 * sample
 *
{"t":0,"c":[{"tx":"作词: "},{"tx":"Will Jennings"}]}
{"t":1000,"c":[{"tx":"作曲: "},{"tx":"James Horner","li":"http://p1.music.126.net/rlzkomHJqfBIQC-eAvbQlA==/697090372014144.jpg","or":"orpheus://nm/artist/home?id=35353&type=artist"}]}
{"t":2000,"c":[{"tx":"编曲: "},{"tx":"James Horner","li":"http://p1.music.126.net/rlzkomHJqfBIQC-eAvbQlA==/697090372014144.jpg","or":"orpheus://nm/artist/home?id=35353&type=artist"}]}
{"t":3000,"c":[{"tx":"制作人: "},{"tx":"Will Jennings"}]}
[00:19.729]Every night in my dreams
[00:24.290]I see you
[00:26.709]I feel you
[00:29.419]That is how I know you go on
[00:41.379]Far across the distance
[00:43.156]And spaces between us.
[00:48.766]You have come to show you go on
[00:58.495]Near far,
[01:02.726]wherever you are
[01:07.289]I believe that the heart does go on
[01:18.170]Once more,
[01:22.188]you open the door,
[01:27.789]And you're here in my heart.
[01:32.060]And my heart will go on and on
[01:41.700]Love can touch us one time.
[01:49.722]And last for a lifetime
[01:57.587]And never let go till we're gone,
[02:06.906]Love was when I loved you
[02:11.390]One true time I hold to.
[02:16.789]In my life we'll always go on.
[02:26.990]Near far,
[02:30.990]wherever you are
[02:34.729]I believe that the heart does go on
[02:45.527]Once more,
[02:49.759]you open the door,
[02:54.270]And you're here in my heart,
[02:59.299]And my heart will go on and on
[03:09.700]You're here,
[03:25.390]You're here,
[03:30.090]there's nothing I fear.
[03:32.979]And I know that my heart will go on
[03:44.990]we'll stay forever this way.
[03:52.990]You are safe in my heart,
[03:57.589]and my heart will go on and on

 */

export function formatLyric(lyric = '') {
  return lyric
    .split('\n')
    .filter(i => !!i)
    ?.map((i, index) => {
      let time = 0
      let sentence = i.match(/](.*)/)?.[1] ?? i
      const reg = /\[\d*:\d*((\.|:)\d*)*\]/g
      const timeStr = i.match(reg)?.[0] ?? ''
      interface Info {
        t: number
        c: Array<{
          tx: string
          li: string
          or: string
        }>
      }
      let info: Info

      if (timeStr) {
        const reg = /\[\d*:\d*((\.|:)\d*)*\]/g
        const timeStr = i.match(reg)?.[0] ?? ''
        time = 0
        // [by: ***]
        // [00:27.54]The many miles we walked
        // [00:56.33]
        // [00:59.54] That's the way it is
        // [00:12]
        const min = Number(timeStr.match(/\[(\d*)/i)?.[1])
        const sec = Number(timeStr.match(/:(\d*)/i)?.[1])
        const mill = timeStr.match(/\.(\d*)]/i)?.[1]
        const millToSec = +(Number(mill ?? 0) / 1000).toFixed(2)
        time = min * 60 + sec + millToSec
        sentence = sentence || '● ● ●'
      }
      else {
        info = toJson(i) as Info
        time = -1
        if (info) {
          const { c } = info
          sentence = `${c[0]?.tx ? c[0].tx : ''}${c[1]?.tx ? c[1].tx : ''}`
        }
        else {
          sentence = ''
        }
      }

      return {
        time,
        sentence,
        index,
      }
    })
}

/**
 * 下载文件
 * 参考 https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * @param url
 * @param name
 */
export function downloadFile(url: string, name?: string) {
  const fileName = name || (url.split('/').pop() ?? url)

  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = url
  tempLink.download = fileName
  tempLink.setAttribute('download', 'download')

  tempLink.setAttribute('target', '_blank')

  document.body.appendChild(tempLink)

  tempLink.click()

  // Fixes "webkit blob resource error 1"
  setTimeout(() => {
    document.body.removeChild(tempLink)
  }, 200)
}

/**
 * file对象转二进制流
 * @param file
 */
export function fileToBuffer(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result)
    }
    try {
      reader.readAsArrayBuffer(file)
    }
    catch (e) {
      reject(e)
    }
  })
}

/**
 * file对象转DataURL
 * @param file
 */
export function fileToDataURL(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result)
    }
    try {
      reader.readAsDataURL(file)
    }
    catch (e) {
      reject(e)
    }
  })
}

/**
 * 图片转DataURL
 * @param image
 */
export function imageToDataUrl(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(image, 0, 0, image.width, image.height)
  return canvas.toDataURL('image/png')
}

/**
 * 从远程获取图片，并转换成DataURL
 * @param url
 */
export function getImageDataUrl(url: string) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.setAttribute('crossOrigin', 'Anonymous')
    image.onload = () => {
      try {
        resolve(imageToDataUrl(image))
      }
      catch (e) {
        reject(e)
      }
    }
    image.onerror = reject
    image.src = url
  })
}

/**
 * 容量单位转换
 * @param _bytes 大小（字节）
 * @param {*} k 标准大小 （1024 ｜ 1000）
 * @returns {string} eg: 2.45KB
 */
export function bytesToSize(_bytes: string | number = 0, k = 1024) {
  const bytes = +_bytes
  if (bytes === 0)
    return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / k ** i).toPrecision(3)} ${sizes[i]}`
}

/**
 * 图片路径追加size参数
 * @param url
 * @param size
 */
export function sizeOfImage(url?: string, size = 512) {
  return url ? `${url}?param=${size}y${size}` : ''
}

/**
 * 格式化时间
 * @param t
 * @param i18n
 */
export function formatDuring(t = 0, i18n = false) {
  const HOUR = 1000 * 60 * 60
  const d = Math.floor(t / (HOUR * 24))
  const h = Math.floor((t % (HOUR * 24)) / HOUR)
  const m = Math.floor((t % HOUR) / (1000 * 60))
  const s = Math.floor((t % (1000 * 60)) / 1000)

  if (i18n) {
    let text = ''
    d && (text += `${d}${i18n ?? 'd'}`)
    h && (text += `${h}${i18n ?? 'h'}`)
    m && (text += `${m}${i18n ?? 'm'}`)
    s && (text += `${s}${i18n ?? 's'}`)
    return text || '-'
  }
  else {
    return `${h > 0 ? `${h < 10 ? `0${h}` : h}:` : ''}${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }
}

export function formatDate(datetime: string | number | undefined, format = 'YYYY.MM.DD') {
  return datetime ? dayjs(datetime).format(format) : '----.--.--'
}

/**
 * 格式化数字
 * @param number
 */
export function formatNumber(number: number, fractionDigits = 2) {
  if (inRange(number, 1000, 1000000))
    return `${(number / 1000).toFixed(fractionDigits)} K`
  else if (inRange(number, 1000001, 1000000000))
    return `${(number / 1000000).toFixed(fractionDigits)} M`
  else if (inRange(number, 1000000001, Number.POSITIVE_INFINITY))
    return `${(number / 1000000000).toFixed(fractionDigits)} B`
  else
    return number
}

export function arrayToObject(arr: Record<string, any>[], keyName: string) {
  const o: Record<string, any> = {}
  arr.forEach((i) => {
    o[i[keyName]] = i
  })
  return o
}

export function toHttps(url = '') {
  return url.replace('http://', 'https://')
}

export function toJson(str: string): boolean | Record<any, any> | Array<any> {
  try {
    const res = JSON.parse(str)
    return res
  }
  catch (error) {
    return false
  }
}

export function hexToRgb(hex: string, format = false) {
  // 去掉可能存在的 # 符号
  hex = hex.replace('#', '')

  // 按照红色、绿色、蓝色的顺序提取颜色分量
  const red = Number.parseInt(hex.substring(0, 2), 16)
  const green = Number.parseInt(hex.substring(2, 4), 16)
  const blue = Number.parseInt(hex.substring(4, 6), 16)

  if (format)
    return `rgb(${red}, ${green}, ${blue})`
  else
    return `${red}, ${green}, ${blue}`
}

export function formatFrequency(frequency: number) {
  // 将频率除以 1000，以得到 kHz 为单位的频率
  const frequencyKHz = frequency / 1000

  // 将 kHz 格式化为带有一位小数的字符串
  const formattedFrequency = frequencyKHz.toFixed(1)

  // 返回格式化后的字符串
  return `${formattedFrequency} kHz`
}


export function now() {
  return +new Date()
}
