import {
  useMemo,
} from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import RadarIcon from '@mui/icons-material/Radar'
import TodayIcon from '@mui/icons-material/Today'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import { useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import ShortCut from './home/shortcut'
import { GridType } from '@/hooks/useResponsiveGrid'
import GridRow from '@/components/GridRow'
import Cover from '@/components/cover/Cover'

import Col from '@/components/Col'
import PageTransition from '@/components/PageTransition'
import HomePageSkeleton from '@/components/skeleton/HomeSkeleton'
import ShortCutFM from '@/pages/home/shortcutFM'
import {
  useQueryPersonalRadarPlaylist,
  useQueryPersonalizedNewAlbums,
  useQueryPersonalizedPlaylists, useQueryPersonalizedRadarPlaylists,
} from '@/hooks/query/home'
import { useMyPlaylist } from '@/hooks/usePlaylist'

function ShortCuts() {
  const theme = useTheme()
  const { favList } = useMyPlaylist()
  const { data: personalRadarPlaylist } = useQueryPersonalRadarPlaylist()
  const { t } = useTranslation()

  const fav = useMemo(() => {
    if (favList) {
      return {
        data: {
          picUrl: favList.coverImgUrl,
          title: t`main.discover.you_liked`,
          id: favList.id,
        },
        type: 'playlist',
        decoration: {
          color: theme.palette.primary.main,
          icon: <FavoriteIcon fontSize="small" color={'onPrimary' as 'primary'}/>,
        },
      }
    }
  }, [favList, theme])
  const radar = useMemo(() => {
    if (personalRadarPlaylist) {
      return {
        type: 'playlist',
        data: {
          id: personalRadarPlaylist.playlist.id,
          picUrl: personalRadarPlaylist.playlist.coverImgUrl,
          title: t`main.discover.radar`,
        },
        decoration: {
          color: theme.palette.secondary.main,
          icon: (
            <RadarIcon fontSize="small" color={'onSecondary' as 'primary'}/>
          ),
        },
      }
    }
  }, [personalRadarPlaylist])

  const shortcuts = useMemo(() => {
    return [
      fav,
      {
        data: {
          picUrl:
            'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
          title: t`main.discover.daily`,
          subTitle: dayjs().format('MM/DD'),
        },
        type: 'daily',
        decoration: {
          color: theme.palette.tertiary.main,
          icon: (
            <TodayIcon fontSize="small" color={'onTertiary' as 'primary'}/>
          ),
        },
      },
      ...(radar ? [radar] : []),
      {
        data: {
          picUrl:
            'https://cdn.dribbble.com/userupload/5937173/file/original-f14b5cf31374d9e829baab07bbf571a9.jpg?resize=752x',
          title: t`main.disk`,
        },
        type: 'cloud',
        decoration: {
          color: theme.palette.tertiary.main,
          icon: (
            <CloudQueueIcon fontSize="small" color={'onTertiary' as 'primary'}/>
          ),
        },
      },
    ]
  }, [radar, fav])

  return (
    <GridRow rowType={GridType.B}>
      {shortcuts.map((i, idx) => {
        return (
          i && (
            <ShortCut
              key={idx}
              type={i.type as any}
              data={i.data}
              decoration={i.decoration}
            />
          )
        )
      })}
      <ShortCutFM />
    </GridRow>
  )
}

function Home() {
  const { data: personalizedPlaylists, isLoading: isLoadingPersonalizedPlaylists } = useQueryPersonalizedPlaylists()
  const { data: personalizedRadarPlaylists } = useQueryPersonalizedRadarPlaylists()
  const { data: personalizedPersonalizedNewAlbums } = useQueryPersonalizedNewAlbums()
  const { t } = useTranslation()
  return (
    <PageTransition>
      {
        isLoadingPersonalizedPlaylists
          ? <HomePageSkeleton />
          : <div className='flex flex-col gap-4 pr-2'>
          <ShortCuts />
          <Col title={t`main.for_you`}>
            <GridRow singleLine rowType={GridType.A}>
              {personalizedPlaylists?.map(data => (
                <Cover type="playlist" key={data.id} data={data}/>
              ))}
            </GridRow>
          </Col>
          <Col title={t`main.radar`}>
            <GridRow singleLine rowType={GridType.A}>
              {personalizedRadarPlaylists?.map(data => (
                <Cover type="playlist" key={data.id} data={data}/>
              ))}
            </GridRow>
          </Col>
          <Col title={t`main.discover.recommend_songs`}>
            <GridRow singleLine rowType={GridType.A}>
              {personalizedPersonalizedNewAlbums?.result?.map(data => (
                <Cover type="album" key={data.id} data={data.song.album}/>
              ))}
            </GridRow>
          </Col>
        </div>
      }
    </PageTransition>

  )
}

export default Home
