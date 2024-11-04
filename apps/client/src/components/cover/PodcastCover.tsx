import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { sizeOfImage, toHttps } from '@/util/fn'
import Image from '@/components/Image'

function PodcastCover({ data, subTitle, inset }: {
  data: any
  subTitle?: string
  inset?: boolean
}) {
  const theme = useTheme()
  const coverBgUrl = sizeOfImage(toHttps(data.picUrl ?? data.coverImgUrl))
  const navigate = useNavigate()
  const _subTitle = subTitle ?? data.rcmdtext

  function jumpTo() {
    navigate(`/podcast/${data.id}`)
  }
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        bgcolor: theme.palette.surfaceVariant.main,
        color: theme.palette.onSurfaceVariant.main,
      }}
      className="cursor-pointer"
      onClick={jumpTo}
    >
      <Box>
        <Box
          sx={{
            position: 'relative',
            aspectRatio: 1,
          }}
        >
          <Image src={coverBgUrl} className="absolute"
            gradient={inset ? `linear-gradient(360deg, ${theme.palette.surface.main}e6 0%, rgb(0 0 0 / 0%) 100%)` : ''}/>
          <div className='absolute top-0 flex h-full w-full'>
            {
              inset && (<Box className='flex items-end pr-16 py-4 pl-2' sx={{
                color: theme.palette.onSurface.main,
              }}>
                <Typography className="line-clamp-2" variant="body2">
                  {data.name}
                </Typography>
              </Box>)
            }
          </div>

        </Box>
        {
          !inset && <CardContent sx={{ px: 1.5 }}>
            <Typography className="line-clamp-1" variant="body2">
              {data.name}
            </Typography>
            <Typography className="line-clamp-1" variant="body2">
              {_subTitle}
            </Typography>
          </CardContent>
        }
      </Box>
    </Card>
  )
}

export default PodcastCover
