import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { cx } from '@emotion/css'
import Image from '@/components/Image'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { LocalArtist } from '@/pages/local/hooks/useQueryArtist'

function LocalArtistCover({ data, compact }: { data: LocalArtist; compact?: boolean }) {
  const theme = useTheme()
  const coverBgUrl = data.avatar
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const navigate = useNavigate()

  function jumpTo() {
    navigate(`/local/artist/${data.name}`, {
      state: data,
    })
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
          <Box className={cx('absolute h-full', 'p-4')}>
            <Image src={coverBgUrl} className="absolute rounded-full" fit='cover' />
          </Box>
        </Box>
        {
          <CardContent sx={{ px: 1.5 }}>
            <Typography className="line-clamp-1 text-center" variant="subtitle2">
              {data.name}
            </Typography>
          </CardContent>
        }

      </Box>
    </Card>
  )
}

export default LocalArtistCover
