import {
  Box,
  Button,
  Card, Chip, Divider,
} from '@mui/material'
import { useMemo, useState } from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CheckIcon from '@mui/icons-material/Check'
import { useTheme } from '@mui/material/styles'
import * as React from 'react'
import FaceIcon from '@mui/icons-material/Face'
import EmojiNature from '@mui/icons-material/EmojiNature'
import Pentagon from '@mui/icons-material/Pentagon'
import StrollerIcon from '@mui/icons-material/Stroller'
import NoStrollerIcon from '@mui/icons-material/NoStroller'
import AddReactionIcon from '@mui/icons-material/AddReaction'
import { useWallpapers } from '@/hooks/useWallpapers'
import PageTransition from '@/components/PageTransition'
import GridRow from '@/components/GridRow'
import { GridType } from '@/hooks/useResponsiveGrid'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import SelectMenu from '@/components/SelectMenu'
import { CATGORY, ORDER, PURITY, SORTING, TOPRANGE, useWallpaperStore } from '@/store/wallpaper'

export default function WallpaperPage({
  select,
}: { select?: boolean }) {
  const { wallpapers } = useWallpapers()
  const [selectedIndex, setSeletedIndex] = useState(-1)
  const [preview, setPreview] = useState(false)
  const [filter, setFilter] = useState(false)
  const theme = useTheme()
  function FilterButton() {
    return <Button
      color={'tertiaryContainer' as 'primary'}
      variant="contained"
      sx={{
        position: 'fixed',
        top: '50vh',
        right: 12,
        height: 50,
        width: 50,
        borderRadius: 3.5,
        minWidth: 50,
        color: theme.palette.onPrimaryContainer.main,
      }}
      onClick={() => { setFilter(true) }}
    >
      <FilterAltIcon />
    </Button>
  }
  return <PageTransition className='relative'>
    <FilterPanel />
    <Box className='flex'>
      <GridRow rowType={GridType.D}>
        {
          wallpapers?.map((wallpaper, index) => {
            return <Card
              key={wallpaper.id}
              className="wallpaper-thumb"
              onClick={() => {
                setSeletedIndex(index)
                setPreview(true)
              }}
              sx={{
                transition: 'outline .35s ease',
                outlineStyle: 'solid',
                outlineWidth: 2,
                outlineColor: (selectedIndex === index) ? theme.palette.primary.main : 'transparent',
              }}
            >
              <Image fit='cover' src={wallpaper.thumbs.large} className='aspect-video'></Image>
            </Card>
          })
        }

      </GridRow>
      <ImageViewer src={wallpapers[selectedIndex]?.path} open={preview} onClose={() => setPreview(false)} />
    </Box>
  </PageTransition>
}

function FilterPanel() {
  const theme = useTheme()
  const {
    wallpapers,
    apiKey,
    setApiKey,
    sorting,
    setSorting,
    order,
    setOrder,
    categories,
    setCategories,
    purity,
    setPurity,
    topRange,
    setTopRange,
    page,
    setPage,
    brightness,
    setBrightness,
    blur,
    setBlur,
    useTrackCover,
    setUseTrackCover,
    proxy,
    setProxy,
  } = useWallpaperStore()

  const topRangeOptions = [
    {
      title: '近 1 天',
      value: TOPRANGE.LASTDAY,
      activeClass: 'text-primary',
    },
    {
      title: '近 3 天',
      value: TOPRANGE.LAST_THREE_DAYS,
      activeClass: 'text-primary',
    },
    {
      title: '近 1 周',
      value: TOPRANGE.LAST_WEEK,
      activeClass: 'text-primary',
    },
    {
      title: '近 1 月',
      value: TOPRANGE.LAST_MONTH,
      activeClass: 'text-primary',
    },
    {
      title: '近 3 月',
      value: TOPRANGE.LAST_THREE_MONTH,
      activeClass: 'text-primary',
    },
    {
      title: '近 6 月',
      value: TOPRANGE.LAST_SIX_MONTH,
      activeClass: 'text-primary',
    },
    {
      title: '近 1 年',
      value: TOPRANGE.LAST_YEAR,
      activeClass: 'text-primary',
    },
  ]

  const orderOptions = [
    {
      title: '降序',
      value: ORDER.DESC,
      activeClass: 'text-primary',
    },
    {
      title: '升序',
      value: ORDER.ASC,
      activeClass: 'text-primary',
    },
  ]

  const sortingOptions = [
    {
      title: '相关性',
      value: SORTING.RELEVANCE,
      activeClass: 'text-primary',
    },
    {
      title: '日期',
      value: SORTING.DATE_ADDED,
      activeClass: 'text-primary',
    },
    {
      title: '收藏数',
      value: SORTING.FAVORITES,
      activeClass: 'text-primary',
    },
    {
      title: '热度',
      value: SORTING.HOT,
      activeClass: 'text-primary',
    },
    {
      title: '排行',
      value: SORTING.TOPLIST,
      activeClass: 'text-primary',
    },
    {
      title: '随机',
      value: SORTING.RANDOM,
      activeClass: 'text-primary',
    },
    {
      title: '浏览数',
      value: SORTING.VIEWS,
      activeClass: 'text-primary',
    },
  ]

  const categoriesOptions = [
    {
      icon: <Pentagon sx={{ fontSize: '1.125rem' }} />,

      title: 'GENERAL',
      value: CATGORY.GENERAL,
      activeClass: 'text-primary',
    },
    {
      icon: <EmojiNature sx={{ fontSize: '1.125rem' }} />,
      title: 'ANIME',
      value: CATGORY.ANIME,
      activeClass: 'text-primary',
    },
    {
      icon: <FaceIcon sx={{ fontSize: '1.125rem' }} />,

      title: 'PEOPLE',
      value: CATGORY.PEOPLE,
      activeClass: 'text-primary',
    },
  ]
  const purityOptions = useMemo(() => {
    const options = [
      {
        icon: <AddReactionIcon sx={{ fontSize: '1.125rem' }} />,
        title: 'SFW',
        value: PURITY.SFW,
        activeClass: 'text-primary',
      },
      {
        icon: <StrollerIcon sx={{ fontSize: '1.125rem' }} />,
        title: 'SKETCHY',
        value: PURITY.SKETCHY,
        activeClass: 'text-primary',
      },
    ]
    if (apiKey) {
      options.push({
        icon: <NoStrollerIcon sx={{ fontSize: '1.125rem' }} />,
        title: 'NSFW',
        value: PURITY.NSFW,
        activeClass: 'text-primary',
      })
    }
    return options
  }, [apiKey])

  return (
    <Box className='sticky top-0 py-3 flex gap-2 items-center justify-center' sx={{ zIndex: 1, bgcolor: theme.palette.surface.main }}>

      <ChipGroup chips={categoriesOptions} value={categories} onChange={(val) => {
        setCategories(val)
      }}></ChipGroup>
      <Divider orientation='vertical' flexItem variant='middle' />
      <ChipGroup chips={purityOptions} value={purity} onChange={(val) => {
        setPurity(val)
      }}></ChipGroup>
      <Divider orientation='vertical' flexItem variant='middle' />
      <div className='flex gap-1'>
        <SelectMenu value={sorting} options={sortingOptions} onChange={(e) => {
          setSorting(e)
        }} />
        {
          sorting === SORTING.TOPLIST && <SelectMenu value={topRange} options={topRangeOptions} onChange={(e) => {
            setTopRange(e)
          }} />
        }
        <SelectMenu value={order} options={orderOptions} onChange={(e) => {
          setOrder(e)
        }} />
      </div>
    </Box>
  )
}

function ChipGroup({ chips, value, onChange }: {
  chips: { title: string; value: any; icon?: React.ReactElement }[]
  value: any[]
  onChange: (val: any[]) => void
}) {
  const theme = useTheme()
  function handleClick(val: any) {
    if (value.includes(val))
      onChange(value.filter(v => (v !== val)))

    else
      onChange(value.concat(val))
  }
  function actived(val: any) {
    return value.includes(val)
  }
  return <div className='flex gap-1'>
    {
      chips.map((chip) => {
        return <Chip
          icon={actived(chip.value) ? <CheckIcon sx={{ fontSize: '1.125rem' }}/> : chip.icon}
          variant={actived(chip.value) ? 'filled' : 'outlined'}
          sx={{
            'borderRadius': 2,
            'fontSize': '0.875rem',
            'fontWeight': 500,
            '&.MuiChip-filled': {
              bgcolor: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
            },
            '&.MuiChip-outlined': {
              borderColor: theme.palette.outline.main,
            },
            '&.MuiChip-root': {
              '.MuiChip-icon': {
                marginLeft: '8px',
                marginRight: '-8px',
              },
              '.MuiChip-label': {
                paddingLeft: '16px',
                paddingRight: '16px',
              },
            },
          }}
          key={chip.value}
          label={chip.title}
          onClick={() => handleClick(chip.value)} />
      })
    }
  </div>
}
