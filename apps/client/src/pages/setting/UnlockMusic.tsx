import { TextField, Typography } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { useTranslation } from 'react-i18next'
import Col from '@/components/Col'
import Switch from '@/components/Switch'
import { useSettingStore } from '@/store/setting'

export default function UnlockMusic() {
  const { t } = useTranslation()
  const { youtubeUnlock, setYoutubeUnlock, unblockNetEaseMusic, setUnblockNetEaseMusic } = useSettingStore()
  const handleProxyChange = useCallback((e: any) => {
    const val = e.target.value
    setYoutubeUnlock({
      open: youtubeUnlock.open,
      proxy: val,
    })
  }, [youtubeUnlock])
  const handleOpenChange = useCallback((e: any) => {
    console.log(e)
    const val = e.target.checked
    setYoutubeUnlock({
      open: val,
      proxy: youtubeUnlock.proxy,
    })
  }, [youtubeUnlock])

  const handleSourceChange = useCallback((e: any) => {
    const val = e.target.value
    setUnblockNetEaseMusic({
      open: unblockNetEaseMusic.open,
      source: val,
    })
  }, [unblockNetEaseMusic])
  const handleOpenUnblockChange = useCallback((e: any) => {
    const val = e.target.checked
    setUnblockNetEaseMusic({
      open: val,
      source: unblockNetEaseMusic.source,
    })
  }, [unblockNetEaseMusic])
  useEffect(() => {
    ipcRenderer.invoke('updateYoutubeConfig', JSON.stringify(youtubeUnlock))
  }, [youtubeUnlock])
  return <div className='flex flex-col gap-2'>
    <div className='mb-3'>
      <Typography variant='subtitle1'>{t`common.source`}</Typography>
    </div>
    <Col variant='caption' title='youtube 解锁' more={<Switch checked={youtubeUnlock.open} onChange={handleOpenChange} />}>
      <div className='flex justify-between items-center gap-2 mx-2'>
        <Typography variant='caption'>proxy: </Typography>
        <TextField size='small' value={youtubeUnlock.proxy} onChange={handleProxyChange} />
      </div>
    </Col>
    <Col variant='caption' title='unblockneteasemusic 解锁' more={<Switch checked={unblockNetEaseMusic.open} onChange={handleOpenUnblockChange} />}>
      <div className='flex justify-between items-center gap-2 mx-2'>
        <Typography variant='caption'>source: </Typography>
        <TextField size='small' value={unblockNetEaseMusic.source} onChange={handleSourceChange} />
      </div>
    </Col>
  </div>
}
