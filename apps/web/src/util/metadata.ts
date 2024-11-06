import * as Colors from '@mui/material/colors'

export const officialPlaylist = {
  2829816518: {
    title: '欧美私人订制',
  },
  2821115454: {
    title: '一周原创发现',
  },
  2409342460: {
    title: '一周新歌推荐',
  },
  2859214503: {
    title: '一周欧美上新',
  },
  2890490211: {
    title: '助眠鸟鸣声',
  },
  2890501416: {
    title: '助眠白噪声',
  },
  5217150082: {
    title: '摇滚唱片行',
  },
  2829961453: {
    title: '古风音乐大赏',
  },
  5212729721: {
    title: '欧美点唱机',
  },
  2860654884: {
    title: '独立女声精选',
  },
}

export const specialType = {
  fav: {
    type: 5,
    id: 5,
    title: '我喜欢的音乐',
  },
  radar: {
    type: 100,
    id: 3136952023,
    title: '私人雷达',
  },
}

export const RADARPLAYLISTS = [
  {
    id: 5320167908,
    name: '时光雷达',
  },
  {
    id: 5362359247,
    name: '宝藏雷达',
  },
  {
    id: 5300458264,
    name: '新歌雷达',
  },
  // {
  //   id: 5341776086,
  //   name: '神秘雷达',
  // },
  {
    id: 5327906368,
    name: '乐迷雷达',
  },
  {
    id: 6700242542,
    name: '雷击顿唱片行',
  },
]

export function getColorTable() {
  const o: Record<string, string> = {}
  Object.entries(Colors).forEach((color) => {
    const name = color[0]
    const colors = color[1]
    Object.entries(colors).forEach(([sub, hex]) => {
      o[`${name}${sub}`] = hex
    })
  })
  return o
}

export const HexColors = Object.values(getColorTable()) ?? []
