import { useTranslation } from 'react-i18next'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSnackbar } from 'notistack'
import { Button, Dialog, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { useConfirm } from 'material-ui-confirm'
import Cover from '../components/Cover'
import { createPlaylist, deletePlayList, renamePlaylist } from '@/pages/local/api/local'
import GridRow from '@/components/GridRow'
import Col from '@/components/Col'
import { useLocalStore } from '@/store/local'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useAddToPlayQueue } from '@/hooks/usePlayQueue'
import { queryPlaylistTracks } from '@/pages/local/hooks/useQueryTrack'

export function LocalPlaylistPanel() {
  const { t } = useTranslation()
  const theme = useTheme()
  const confirm = useConfirm()
  const { playNext } = useAddToPlayQueue()
  const { playlist, refreshPlaylist } = useLocalStore()
  const [open, setOpen ] = useState<boolean>(false)
  const [ modalData, setModalData ] = useState<null | { id: number; name: string }>(null)

  const { openContextMenu } = useContextMenu()

  const onContextMenu = useCallback((e: React.MouseEvent<HTMLElement>, data: any) => {
    const items = [{
      type: 'item' as any,
      label: t`common.add_to_queue`,
      onClick: async () => {
        const tracks = await queryPlaylistTracks(data.id)
        if (tracks?.length)
          playNext(tracks, { id: 0, type: 'local', name: '本地音乐' })
      },
    },
    {
      type: 'divider' as any,
    },
    {
      type: 'item' as any,
      label: '重命名',
      onClick: () => {
        setModalData(data)
        setOpen(true)
      },
    },
    {
      type: 'item' as any,
      label: t`main.playlist.delete`,
      onClick: async () => {
        confirm({
          description: t`message.delete_list_alert`,
          title: t`message.delete_list`,
          dialogProps: { maxWidth: 'xs' },
        }).then(async () => {
          await deletePlayList(data.id)
          refreshPlaylist()
        })
      },
    },
    ]
    openContextMenu(e, items, { useCursorPosition: true })
  }, [])

  const onClose = useCallback(() => {
    setOpen(false)
    refreshPlaylist()
  }, [])


  return <div className='flex flex-col gap-4'>
    <Col title={t`main.local.created_list`} variant='body1' more={<Tooltip title={t`main.playlist.new`} placement='left'>
      <IconButton
        sx={{
          bgcolor: alpha(theme.palette.tertiaryContainer.main, theme.palette.action.activatedOpacity),
        }}
        color={'tertiary' as 'primary'}
        size='small'
        onClick={() => {
          setModalData(null)
          setOpen(true)
        }}
      >
        <AddCircleOutlineOutlinedIcon fontSize='small' />
      </IconButton>
    </Tooltip>
    }>
      <GridRow>
        {
          playlist.map((playlist: any) => (<Cover key={playlist.id} type='playlist' data={playlist} onContextMenu={onContextMenu} />))
        }
      </GridRow>
    </Col>
    <CreateDialog open={open} onClose={onClose} playlist={modalData}></CreateDialog>
  </div>
}

export function CreateDialog({ open, onClose, playlist }:
{ open: boolean; onClose: () => void; playlist?: { id: number; name: string } }) {

  const theme = useTheme()
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [playlistName, setName] = useState('新建播放列表')

  const isCreate = useMemo<boolean>(() => !playlist, [playlist])
  useEffect(() => {
    if (playlist)
      setName(playlist.name)
  }, [playlist])

  useEffect(() => {
    if (!open)
      setName('')

    return () => {
      setName('')
    }
  }, [open])

  async function createNewPlaylist() {
    try {
      await createPlaylist(playlistName)
      onClose()
    }
    catch (e) {}
  }


  async function handleRenamePlaylist() {
    try {
      await renamePlaylist(playlist.id, playlistName)
      onClose()
    }
    catch (e) {}
  }

  async function handleConfirm() {
    if (isCreate)
      await createNewPlaylist()
    else
      await handleRenamePlaylist()
  }

  return <Dialog sx={{
    '& .MuiPaper-root': {
      borderRadius: 8,
    },
  }} open={open} onClose={onClose}>
    <Box className='pt-5 pb-4 px-2 flex flex-col' sx={{
      bgcolor: theme.palette.surfaceVariant.main,
      color: theme.palette.onSurfaceVariant.main,
      minWidth: 320,
    }}>
      <div className='flex flex-col items-center mb-4 gap-1'>
        <QueueMusicIcon />
        <Typography variant='body1'>{isCreate ? t`main.local.new_playlist` : t`main.local.rename_playlist`}</Typography>
      </div>

      <div className='px-3'>
        <TextField className='w-full' variant='outlined'  label='播放列表名称' value={playlistName} onChange={(e: any) => {
          setName(state => e.target.value)
        }} />
      </div>
      <div className='flex justify-end mt-2'>
        <Button variant='text' onClick={onClose}>{t`common.cancel`}</Button>
        <Button variant='text' onClick={handleConfirm}>{t`common.confirm`}</Button>
      </div>
    </Box>
  </Dialog>
}


