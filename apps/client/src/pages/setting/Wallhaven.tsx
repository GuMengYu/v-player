import { TextField, Typography } from '@mui/material'
import { useCallback } from 'react'
import Col from '@/components/Col'
import Switch from '@/components/Switch'
import { useWallpaperStore } from '@/store/wallpaper'

export default function WallhavenSetting() {
  const { proxy, setProxy, apiKey, setApiKey } = useWallpaperStore()
  const handleProxyChange = useCallback((e: any) => {
    const val = e.target.value
    setProxy({
      open: proxy.open,
      url: val,
    })
  }, [proxy])
  const handleOpenChange = useCallback((e: any) => {
    const val = e.target.checked
    setProxy({
      open: val,
      url: proxy.url,
    })
  }, [proxy])
  const handleApikeyChange = useCallback((e: any) => {
    const val = e.target.value
    setApiKey(val)
  }, [])
  return <div className='flex flex-col gap-2'>
    <Col variant='subtitle1' title='wallhaven' more={<Switch checked={proxy.open} onChange={handleOpenChange} />}>
      <div className='flex justify-between items-center gap-2 mb-1 mx-2'>
        <Typography variant='caption'>apikey: </Typography><TextField size='small' value={apiKey} onChange={handleApikeyChange} />
      </div>
      <div className='flex justify-between items-center gap-2 mx-2'>
        <Typography variant='caption'>proxy: </Typography><TextField size='small' value={proxy.url} onChange={handleProxyChange} />
      </div>

    </Col>
  </div>
}
