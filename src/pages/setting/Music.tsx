import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import Col from '@/components/Col'
import { QUALITY_LEVEL, useSettingStore } from '@/store/setting'
import SelectMenu from '@/components/SelectMenu'
import useMediaDevices from '@/hooks/useMediaDevices'
import { player } from '@/contexts/player'

export default function MusicSetting() {
  const { quality, setQuality, dynamicBg, setDynamicBg, setOutputdevice, outputdevice } = useSettingStore()
  const { outputDevices } = useMediaDevices()
  const { t } = useTranslation()

  const outputDevicesOption = useMemo(() => {
    if (outputDevices.length) {
      return outputDevices.map((device) => {
        return {
          title: device.label,
          value: device.deviceId,
        }
      })
    }
    else {
      return [
        {
          title: 'No devices',
          value: null,
        },
      ]
    }
  }, [outputDevices])
  const handleOutputDeviceChange = useCallback((deviceId: string) => {
    setOutputdevice(deviceId)
    player.setOutPutDevice(deviceId)
  }, [])

  return <div>
    <div className='mb-3'>
      <Typography variant='subtitle1'>{t`common.quality`}</Typography>
    </div>
    <Col variant='caption' title={t`main.setting.device`} more={
      <SelectMenu value={outputdevice} options={outputDevicesOption} onChange={handleOutputDeviceChange} />
    }>
    </Col>
    <Col variant='caption' title={t`main.setting.quality`} more={
      <SelectMenu value={quality} options={[
        {
          title: '标准',
          value: QUALITY_LEVEL.STANDARD,
        },
        {
          title: '较高',
          value: QUALITY_LEVEL.HIGHER,
        },
        {
          title: '极高(vip)',
          value: QUALITY_LEVEL.EXHIGH,
        },
        {
          title: '无损(vip)',
          value: QUALITY_LEVEL.LOSSLESS,
        },
        {
          title: 'Hi-Res(vip)',
          value: QUALITY_LEVEL.HIRES,
        },
        {
          title: '高清环绕声(vip)',
          value: QUALITY_LEVEL.JYEFFECT,
        },
        {
          title: '沉浸环绕声(vip)',
          value: QUALITY_LEVEL.SKY,
        },
        {
          title: '超清母带(vip)',
          value: QUALITY_LEVEL.JYMASTER,
        },
      ]} onChange={setQuality} />
    }>

    </Col>
    {/*<Col variant='caption' title='正在播放页动态背景' more={*/}
    {/*  <Switch checked={dynamicBg} onChange={(_, v) => {*/}
    {/*    setDynamicBg(v)*/}
    {/*  }} />*/}
    {/*}>*/}
    {/*</Col>*/}
  </div>
}
