import { useQuery } from '@tanstack/react-query'
import { Button, IconButton, Typography, useTheme } from '@mui/material'
import { useRef } from 'react'
import { useSnackbar } from 'notistack'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useImmer } from 'use-immer'
import { useTranslation } from 'react-i18next'
import PageTransition from '@/components/PageTransition'
import { cloudDiskMusicList, uploadMusicToCloudDisk } from '@/api/cloud'
import CloudTrackList from '@/pages/cloud/CloudTrackList'
import { Track } from '@/types'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import Image from '@/components/Image'

const UPLOAD_STATE = {
  NORMAL: { text: '等待中', icon: 'normal', val: 'NORMAL', class: 'normal' },
  PENDING: { text: '上传准备中', icon: 'pending', val: 'PENDING', class: 'pending' },
  UPLOADING: { text: '正在上传', icon: 'upload', val: 'UPLOADING', class: 'upload' },
  UPLOADED: { text: '上传完成', icon: 'uploaded', val: 'UPLOADED', class: 'uploaded' },
  CONVERT: { text: '转换中', icon: 'convert', val: 'CONVERT', class: 'convert' },
  FAILED: { text: '上传失败', icon: 'failed', val: 'FAILED', class: 'failed' },
  ALREADY_UPLOADED: { text: '云盘里已存在', icon: 'uploaded', val: 'ALREADY_UPLOADED', class: 'uploaded' },
}
function Header({ tracks, reload }: { tracks: Track[]; reload: () => void }) {
  const theme = useTheme()
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const { openContextMenu } = useContextMenu()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  const uploadRef = useRef<HTMLInputElement>()
  const [uploadMusic, setUploadMusic] = useImmer({
    visible: false,
    file: null as File | null,
    state: UPLOAD_STATE.NORMAL.val,
    uploading: false,
    uploadedPercent: 0,
    uploadedSize: 0,
  })

  function handlePlay() {
    replaceQueueAndPlay(tracks, 0, 'cloud', '云盘')
  }
  function handleMore(e: React.MouseEvent<HTMLElement>) {
    openContextMenu(e, [
      {
        type: 'item',
        label: t`main.cloud.upload`,
        onClick: () => {
          handleUploadTrack()
        },
      },
    ])
  }

  function handleUploadTrack() {
    uploadRef.current?.click()
  }
  function handleChange(e: any) {
    const { files } = e.target as HTMLInputElement
    const file = files?.[0]
    if (file) {
      if (file.size > 80 * 1024 * 1024) {
        enqueueSnackbar('上传歌曲大小不能超过80M', {
          variant: 'warning',
        })
        return
      }
      try {
        setUploadMusic((draft) => {
          draft.visible = true
          draft.file = file
          draft.state = UPLOAD_STATE.PENDING.val
        })
        uploadMusicToCloudDisk(file, {
          timeout: Number.POSITIVE_INFINITY,
          onUploadProgress: (progressEvent: ProgressEvent) => {
            const { lengthComputable, total, loaded } = progressEvent
            if (lengthComputable) {
              setUploadMusic((draft) => {
                draft.uploadedSize = loaded
                draft.uploadedPercent = +((loaded / total) * 100).toFixed(2)
              })
              if (total === loaded) {
                setUploadMusic((draft) => {
                  draft.state = UPLOAD_STATE.CONVERT.val
                  draft.uploadedPercent = +((loaded / total) * 100).toFixed(2)
                })
              }
            }
          },
        }).then((res) => {
          const { data } = res
          if (data.code === 200) {
            setUploadMusic((draft) => {
              draft.state = UPLOAD_STATE.UPLOADED.val
            })
            enqueueSnackbar('音乐已上传')
            reload()
          }
          else if (data.code === 201) {
            setUploadMusic((draft) => {
              draft.state = UPLOAD_STATE.ALREADY_UPLOADED.val
            })
            enqueueSnackbar('音乐文件已存在')
          }
        })
      }
      catch (e) {
        setUploadMusic((draft) => {
          draft.state = UPLOAD_STATE.FAILED.val
        })
        enqueueSnackbar('上传失败', { variant: 'error' })
        console.log(e)
      }
    }
  }
  return (
    <motion.div
      initial={{
        opacity: 0, transform: 'translateX(15px)',
      }}
      animate={{
        opacity: 1, transform: 'translateX(0px)',
      }}
      transition={{
        duration: 0.25,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <div className="flex flex-col">
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '256px' }}>
          <Image
            className="absolute"
            src={'https://cdn.dribbble.com/userupload/7493980/file/original-8f0a3d7df35ac545a825674534cc4775.png'}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className='flex-1'></div>

            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{t`main.cloud.my`}</Typography>
              <div className="flex flex-col">
                <Typography variant="caption">
                  {t`main.cloud.desc`}
                </Typography>
              </div>
              <div className='flex gap-3'>
                <Button disableElevation variant='contained' sx={{
                  'bgcolor': `${theme.palette.primary.main}1f`,
                  'color': theme.palette.primary.main,
                  'borderRadius': 2.5,
                  'px': 1.5,
                  'py': 1.5,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}38`,
                  },
                }} onClick={handlePlay}>
                  <PlayArrowIcon color='primary' className='mr-1' /> {t`common.play_all`}
                </Button>
                <IconButton size='large' sx={{
                  bgcolor: `${theme.palette.tertiary.main}1f`,
                }} onClick={handleMore}>
                  <MoreHorizIcon/>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input style={{
        display: 'none',
      }} ref={uploadRef} type="file" accept="audio/mpeg,audio/flac" onChange={handleChange} />

    </motion.div>
  )
}
export default function CloudPage() {
  const { data: clouds, isLoading, refetch } = useQuery(['cloud', 'music'], async () => {
    const { data } = await cloudDiskMusicList({ limit: 500, offset: 0 })
    return data.map(song => song.simpleSong)
  })
  return <PageTransition>
    <Header tracks={clouds} reload={refetch} />
    {
      clouds?.length && <CloudTrackList tracks={clouds} />
    }

  </PageTransition>
}
