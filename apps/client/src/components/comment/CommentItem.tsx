import { Avatar, Divider, Typography } from '@mui/material'
import { Comment } from '@/types'
import { formatDate, sizeOfImage, toHttps } from '@/util/fn'

export default function CommentItem({ comment }: {
  comment: Comment
}) {
  const avatarUrl = toHttps( sizeOfImage(comment.user.avatarUrl, 256))
  const name = comment.user.nickname
  return <div className='py-2 flex flex-col gap-1'>
    <div>
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <Avatar alt={name} src={avatarUrl} />
          <Typography variant='body2'>{ comment.user.nickname }</Typography>
        </div>
      </div>
      <Typography variant='caption'>{ formatDate(comment.time) }</Typography>
    </div>
    <Typography variant='body2' className="select-text">
      { comment.content }
    </Typography>
    <Divider flexItem sx={{ mt: 2 }} />
  </div>
}
