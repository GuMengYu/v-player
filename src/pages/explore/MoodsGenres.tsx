import { useQuery } from '@tanstack/react-query'
import random from 'lodash/random'
import groupBy from 'lodash/groupBy'

import { useNavigate } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import { getCatList } from '@/api/playlist'
import { HexColors } from '@/util/metadata'
import Col from '@/components/Col'
import GridRow from '@/components/GridRow'
import MdTag from '@/components/Tag'

const randomColor = () => HexColors[random(0, HexColors.length)]
export default function MoodsGenresPage() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery(['moodsgenres', 'cats'], async () => {
    const { sub, categories } = await getCatList()
    const items = sub.map((i: any) => {
      i.color = randomColor()
      return i
    })
    const group = groupBy(items, 'category') ?? {}
    let cats = []
    cats = Object.entries(group).map(([k, v]) => ({
      title: categories[k],
      tags: v,
    }))
    cats.unshift({
      title: '推荐',
      tags: [
        {
          color: randomColor(),
          name: '官方',
        },
        {
          color: randomColor(),
          name: '精品',
        },
        {
          color: randomColor(),
          name: '推荐',
        },
      ],
    })
    return {
      cats,
    }
  }, {
    staleTime: 5 * 60 * 1000,
  })
  return <PageTransition>
    {
      data?.cats?.map((cat) => {
        return <Col variant='h6' title={cat.title} key={cat.title}>
          <GridRow>
            {
              cat.tags.map((tag) => {
                return <MdTag onClick={() => {
                  navigate(`/moods_and_genres/${tag.name}?color=${encodeURIComponent(tag.color)}`)
                }} key={tag.name} name={tag.name} tagcolor={tag.color} to={`${tag.name}`} />
              })
            }
          </GridRow>
        </Col>
      })
    }
  </PageTransition>
}
