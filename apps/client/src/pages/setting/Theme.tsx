import Brightness4Icon from '@mui/icons-material/Brightness4'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'
import LandscapeIcon from '@mui/icons-material/Landscape'
import { useTranslation } from 'react-i18next'
import { Button, Dialog, IconButton, Slider, TextField, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Box } from '@mui/system'
import PaletteIcon from '@mui/icons-material/Palette'
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useSnackbar } from 'notistack'
import Group from '@/components/Group'
import { APPEARANCE, THEME_COLOR, useSettingStore } from '@/store/setting'
import Col from '@/components/Col'
import { useContextMenu } from '@/hooks/useContextMenu'
import { generateMUITheme } from '@/plugins/theme'
import { fileToDataURL } from '@/util/fn'

const GenerateByImage = forwardRef(({ onApplyTheme }: { onApplyTheme: (link: string) => void }, ref) => {
  const uploadRef = useRef<HTMLInputElement>()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const onChange = (e: any) => {
    const { files = [] } = e.target
    if (files?.length) {
      if (files[0].size > 2 * 1024 * 1024) {
        enqueueSnackbar(t('message.pic_limit'))
        return
      }
      try {
        fileToDataURL(files[0]).then((res) => {
          onApplyTheme(res as string)
        })
      }
      catch (e) {
        console.error(e)
      }
    }
  }
  useImperativeHandle(ref, () => {
    return {
      open: () => {
        uploadRef.current?.click()
      },
    }
  }, [])
  return <input style={{
    display: 'none',
  }} ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onChange} />
})

function GenerateByLink({ open, onClose, onApplyTheme, type }: { open: boolean; onClose: () => void; onApplyTheme: (link: string) => void; type: 'code' | 'link' }) {
  const theme = useTheme()
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [link, setLink] = useState('')

  const handleClose = () => {
    setLink('')
    onClose()
  }
  const generate = () => {
    if (link) {
      onApplyTheme(link)
      handleClose()
    }
    else {enqueueSnackbar('请先输入图片链接')}
  }

  return <Dialog sx={{
    '& .MuiPaper-root': {
      borderRadius: 8,
    },
  }}  open={open} onClose={handleClose} >
    <Box className='pt-5 pb-4 px-2 flex flex-col' sx={{
      bgcolor: theme.palette.surfaceVariant.main,
      color: theme.palette.onSurfaceVariant.main,
      minWidth: 320,
    }}>
      <div className='flex flex-col items-center mb-4 gap-1'>
        <PaletteIcon />
        <Typography variant='body1'>{t`main.setting.custom_theme`}</Typography>
      </div>

      <div className='px-3 my-3'>
        <TextField className='w-full' variant='outlined'  label={ type === 'code'  ? t`common.color_code` :  t`common.image_link`} value={link} onChange={(e: any) => {
          setLink(e.target.value)
        }} />
      </div>
      <div className='flex justify-end'>
        <Button variant='text' onClick={handleClose}>{t`common.cancel`}</Button>
        <Button variant='text' onClick={generate}>{t`common.confirm`}</Button>
      </div>
    </Box>
  </Dialog>
}


export default function ThemeSetting() {
  const { appearance, setAppearance, themeColor, fontSize, setThemeColor, setCustomTheme, setFontSize } = useSettingStore()
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const { openContextMenu } = useContextMenu()
  const [open, setOpen]  = useState(false)
  const [type, setType]  = useState<'code' | 'link'>('code')
  const byImageRef = useRef<{ open: () => void }>()

  const handThemeMore = (e: any) => {
    openContextMenu(e, [{
      type: 'item',
      label: t`main.setting.gen_by_image`,
      onClick: () => {
        setType('link')
        byImageRef.current?.open()
      },
    },
    {
      type: 'item',
      label: t`main.setting.gen_by_link`,
      onClick: () => {
        setType('link')
        setOpen(true)
      },

    },
    {
      type: 'item',
      label: t`main.setting.gen_by_code`,
      onClick: () => {
        setType('code')
        setOpen(true)
      },
    }])
  }
  function applyCustomTheme(val: string) {
    try {
      let source
      if (type === 'link') {
        const image = new Image()
        image.src = val
        image.crossOrigin = 'anonymous'
        source = image
      }
      else {
        source = val
      }

      generateMUITheme(source, 'Palette').then((res) => {
        setCustomTheme(res.palette)
        setThemeColor(THEME_COLOR.Customize)
      })
    }
    catch (e) {
      enqueueSnackbar(t`message.something_wrong`, { variant: 'error' })
    }

  }

  function handleFontSizeChange(e: Event, val: number | number[]) {
    console.log(val)
    if (typeof val === 'number')
      setFontSize(val)

  }
  return <div>
    <Col variant='caption' title={t`common.appearance`} className='mb-4'>
    <Group exclusive items={[{
      icon: <BrightnessHighIcon fontSize='small'/>,
      title: t`common.light`,
      value: APPEARANCE.LIGHT,
    },
    {
      icon: <Brightness4Icon fontSize='small' />,
      title: t`common.dark`,
      value: APPEARANCE.DARK,
    },
    {
      icon: <BrightnessAutoIcon fontSize='small' />,
      title: t`common.auto`,
      value: APPEARANCE.SYSTEM,
    },
    ]} value={appearance} onChange={setAppearance}></Group>
    </Col>
    <Col title={t`common.theme_color`} variant='caption' className='mb-4' more={
      <Tooltip title={t`main.setting.custom_theme`} placement='top'>
        <IconButton
          sx={{
            bgcolor: alpha(theme.palette.tertiaryContainer.main, theme.palette.action.activatedOpacity),
          }}
          color={'tertiary' as 'primary'}
          size='small'
          onClick={handThemeMore}
        >
          <ColorLensOutlinedIcon fontSize='small' />
        </IconButton>
      </Tooltip>

    }>
      <Group exclusive items={[
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.GreenRockyMountains,
          title: t`theme.GreenRockyMountains`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.OrangeDesert,
          title: t`theme.OrangeDesert`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.BlueMountains,
          title: t`theme.BlueMountains`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.GreenMountainTop,
          title: t`theme.GreenMountainTop`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.RedSandDunes,
          title: t`theme.RedSandDunes`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.Customize,
          title: t`theme.Customize`,
        },
      ]} value={themeColor} onChange={setThemeColor}></Group>
    </Col>
    <Col title={t`common.font_size`} variant='caption'>
      <div className='w-1/3'>
        <Slider
          size='small'
          value={fontSize}
          step={2}
          marks
          min={10}
          max={20}
          onChange={handleFontSizeChange}
        ></Slider>
      </div>

    </Col>
    <GenerateByImage onApplyTheme={applyCustomTheme} ref={byImageRef} />
    <GenerateByLink open={open} onClose={() => setOpen(false)} onApplyTheme={applyCustomTheme} type={type} />
  </div>
}

