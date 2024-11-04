import { Box, IconButton, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { useQuery } from '@tanstack/react-query'
import { CommentType, useCommentStore } from '@/store/comment'
import { getAlbumComment } from '@/api/album'
import { getPlayListComment } from '@/api/playlist'
import { getMusicComment } from '@/api/song'
import { getMVComment } from '@/api/mv'
import Col from '@/components/Col'
import CommentItem from '@/components/comment/CommentItem'
import { Comment } from '@/types'
import CommentSkeleton from '@/components/skeleton/CommentSkeleton'

function useQueryComment(id: number, type: CommentType, offset: number) {

  return useQuery(['comment', type, id, offset], async () => {
    const service = {
      album: getAlbumComment,
      playlist: getPlayListComment,
      music: getMusicComment,
      mv: getMVComment,
    }[type]
    return await service(id, 20, offset)
  }, {
    enabled: !!id && !!type,
    staleTime: 5 * 60 * 1000,
  })

}

export default function CommentDialog() {
  const { closeComment, open, id, type } = useCommentStore()
  const theme = useTheme()
  const { t } = useTranslation()
  const [page, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const { data, isLoading } = useQueryComment(id, type, page * 20)

  useEffect(() => {
    if (data?.total)
      setTotal(data.total)

  }, [data])


  // useEffect(() => {
  //   if (showComment && id) {
  //
  //   }
  //   return () => {
  //
  //   }
  // }, [showComment, id, type])

  const onClose = useCallback(() => {
    closeComment()
  }, [])
  return (
    <Modal open={open} onClose={onClose} sx={{
      '&:focus-visible': {
        outline: 'none',
      },
      '& .MuiModal-backdrop': {
        backdropFilter: 'blur(100px)',
      },
    }}>
      <Fade in={open}>
        <Box sx={{
          color: theme.palette.onSurface.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          outline: 'none',
        }}>

          <div className='flex flex-col items-center w-1/2 relative'>
            <Box
            sx={{
              height: 'calc(100vh - 128px)',
              overflowY: 'auto',
              width: '100%',
            }}
            >
              {isLoading ? <CommentSkeleton /> : null}

              {
                data?.hotComments?.length ?  <Col variant='body1' title={t`common.hot_comment`}>
                  {
                    data?.hotComments?.map((comment: Comment) => {
                      return <CommentItem comment={comment} key={comment.commentId} />
                    })
                  }
                </Col> : null
              }

              {data?.comments?.length ? <Col variant='body1' className='mt-4' title={t`common.new_comment`}>
                {
                  data?.comments?.map((comment: Comment) => {
                    return <CommentItem comment={comment} key={comment.commentId} />
                  })
                }
              </Col> : null
              }
            </Box>
             <div className='mt-4 relative flex justify-center w-full items-center'>
              <IconButton onClick={onClose} sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.35),
              }} size='large'><CloseIcon/></IconButton>
            </div>

          </div>
        </Box>
      </Fade>
    </Modal>)
}

