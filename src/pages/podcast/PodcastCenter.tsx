import Box from '@mui/material/Box'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import random from 'lodash/random'

import { useTranslation } from 'react-i18next'
import PageTransition from '@/components/PageTransition'
import { podcastCats, recommendCatAndPodcast, recommendPodcast } from '@/api/podcast'
import Col from '@/components/Col'
import PodcastCover from '@/components/cover/PodcastCover'
import GridRow from '@/components/GridRow'
import MdTag from '@/components/Tag'
import { HexColors } from '@/util/metadata'
import { GridType } from '@/hooks/useResponsiveGrid'
import ExploreSkeleton from '@/components/skeleton/ExploreSkeleton'

const randomColor = () => HexColors[random(0, HexColors.length)]

export default function PodcastCenter() {
  const { t } = useTranslation()
  const { data: podcasts } = useQuery(['podcast', 'recommend'], async () => recommendPodcast())
  const { data: cats, isLoading } = useQuery(['podcast', 'cats'], async () => {
    const { categories } = await podcastCats()
    return {
      categories: categories.map((cat: any) => {
        cat.color = randomColor()
        return cat
      }),
    }
  })
  const { data: hotCatRecommend } = useQuery(['podcast', 'hot', 'cats', 'recommend'], () => recommendCatAndPodcast())
  const navigate = useNavigate()
  return <PageTransition>
    {
      isLoading
        ? <ExploreSkeleton />
        : <Box className='pr-2 flex flex-col gap-4'>
        <Col title={t`main.podcast.cat`} variant='h6'>
          <GridRow>
            {
              cats?.categories?.map((i: any) => {
                return <MdTag onClick={() => {
                  navigate(`/podcast_genres/${i.name}/${i.id}?color=${encodeURIComponent(i.color)}`)
                }} tagcolor={i.color} to={`/${i.name}/${i.id}`} key={i.id} name={i.name} />
              })
            }
          </GridRow>
        </Col>
        <Col variant='h6' title={t`main.podcast.recommend`}>
          <GridRow singleLine>
            {
              podcasts?.djRadios?.map((podcast) => {
                return <PodcastCover data={podcast} key={podcast.id} />
              })
            }
          </GridRow>
        </Col>
        <div className='grid grid-cols-2 gap-4'>
          {
            hotCatRecommend?.data?.map((i) => {
              return <Col
                className='col-span-1'
                variant='h6'
                key={i.categoryId}
                title={i.categoryName}
                more={`/podcast_genres/${i.categoryName}/${i.categoryId}`}
              >
                <GridRow rowType={GridType.B} singleLine>
                  {
                    i.radios.map((podcast) => {
                      return <PodcastCover data={podcast} key={podcast.id} />
                    })
                  }
                </GridRow>
              </Col>
            })
          }
        </div>
      </Box>
    }

  </PageTransition>
}
