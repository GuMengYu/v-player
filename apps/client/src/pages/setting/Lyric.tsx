import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import Col from '@/components/Col'

import Switch from '@/components/Switch'
import { useSettingStore } from '@/store/setting'


export default function LyricSetting() {
  const { lyricTrans, setLyricTrans, lyricBlur, setLyricBlur } = useSettingStore()
  const { t } = useTranslation()


  return <div>
    <div className='mb-3'>
      <Typography variant='subtitle1'>{t`common.lyric`}</Typography>
    </div>
    <Col variant='caption' title='歌词翻译' more={
      <Switch checked={lyricTrans} onChange={(_, v) => {
        setLyricTrans(v)
      }} />
    }>
    </Col>
    <Col variant='caption' title='歌词模糊' more={
      <Switch checked={lyricBlur} onChange={(_, v) => {
        setLyricBlur(v)
      }} />
    }>
    </Col>
  </div>
}
