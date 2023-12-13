import { useTheme } from '@mui/material/styles'
import { Card, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSearch } from '@/hooks/query/search'
import PageTransition from '@/components/PageTransition'
import Col from '@/components/Col'
import Cover from '@/components/cover/Cover'
import TrackList from '@/components/TrackList'
import ArtistCover from '@/components/cover/ArtistCover'
import GridRow from '@/components/GridRow'
import VideoCover from '@/components/cover/VideoCover'
import { GridType } from '@/hooks/useResponsiveGrid'
import SearchSkeleton from '@/components/skeleton/SearchSkeleton'
import useSearchParams from '@/hooks/useSearchParams'

export default function Search() {
  const { t } = useTranslation()
  const { searchParams } = useSearchParams()
  console.log(searchParams)
  const searchKeyword = searchParams.get('keyword')
  const { data, isLoading } = useSearch(searchKeyword)
  const theme = useTheme()
  return <PageTransition>
    {
      isLoading
        ? <SearchSkeleton />
        : <section className='flex flex-col gap-4 pr-2'>
        <div
          className='grid grid-cols-5 gap-4'
        >
          <Col title={t`common.search_hot`} variant='subtitle1' className='flex flex-col col-span-2'>
            <Card variant='outlined' sx={{
              flex: 1,
              bgcolor: theme.palette.surfaceVariant.main,
              color: theme.palette.onSurfaceVariant.main,
              borderRadius: 4,
              p: 2,
            }}>
              <GridRow singleLine rowType={GridType.B}>
                {
                  data?.result?.bestMatch?.map((i: any) => {
                    let content
                    if (i.type === 'artist') {
                      content = <ArtistCover compact data={i.object} key={i.object.id} />
                    }
                    else {
                      content = <Cover
                        data={i.object}
                        key={i.type}
                        type={i.type}
                        inset
                      ></Cover>
                    }
                    return <div key={i.object.id} className='flex flex-col gap-4'>
                      {content}
                      <div className='flex flex-col items-center'>
                        <Typography variant='caption'>{ i.object.name }</Typography>
                        <Typography variant='caption'>{ i.type }</Typography>
                      </div>
                    </div>
                  })
                }
              </GridRow>
            </Card>
          </Col>
          {
            data?.result?.songs && <Col title={t`main.tracks`} variant='subtitle1' className='col-span-3'>
                  <TrackList tracks={data?.result?.songs} trackFrom={{ id: searchKeyword, name: '搜索页', type: 'search' }} />
              </Col>
          }
        </div>
        {
          data?.result?.artists?.length && <Col title={t`main.artists`} variant='subtitle1'>
                <GridRow>
                  {
                    data?.result?.artists.map(i => <ArtistCover data={i} key={i.id} />)
                  }
                </GridRow>
            </Col>
        }
        {
          data?.result?.albums?.length && <Col title={t`main.albums`} variant='subtitle1'>
                <GridRow>
                  {
                    data?.result?.albums.map(i => <Cover data={i} key={i.id} type='album' />)
                  }
                </GridRow>
            </Col>
        }
        {
          data?.result?.playlists?.length && <Col title={t`main.playlists`} variant='subtitle1'>
                <GridRow>
                  {
                    data?.result?.playlists.map(i => <Cover data={i} key={i.id} type='playlist' />)
                  }
                </GridRow>
            </Col>
        }
        {
          data?.result?.mvs?.length && <Col title={t`main.mvs`} variant='subtitle1'>
                <GridRow rowType={GridType.B}>
                  {
                    data?.result?.mvs.map(i => <VideoCover data={i} key={i.id} />)
                  }
                </GridRow>
            </Col>
        }
      </section>
    }

  </PageTransition>
}
