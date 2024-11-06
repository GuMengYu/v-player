import { IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import { resourceLike } from '@/api/music'
import { RESOURCE_TYPE } from '@/util/enum'

export default function ResourceThumbToggle({
  type,
  id,
  liked,
}: {
  type: RESOURCE_TYPE
  id: number
  liked?: boolean
}) {
  const [_liked, setLiked] = useState(false)
  async function likeResource() {
    const { code } = await resourceLike(type, id!, _liked ? 0 : 1)
    if (code === 200)
      setLiked(!_liked)
  }

  useEffect(() => {
    if (liked)
      setLiked(true)
    else
      setLiked(false)
  }, [liked])
  return <IconButton
    onClick={likeResource}
    sx={{ height: 48, width: 48 }}
    color="error"
  >
    {
      _liked ? <ThumbUpAltIcon fontSize='small'/> : <ThumbUpOffAltIcon fontSize='small'/>
    }
  </IconButton>
}
