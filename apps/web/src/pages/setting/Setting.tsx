import Box from '@mui/material/Box'
import { Divider } from '@mui/material'
import PageTransition from '@/components/PageTransition'
import ThemeSetting from '@/pages/setting/Theme'
import MusicSetting from '@/pages/setting/Music'

// import WallhavenSetting from '@/pages/setting/Wallhaven'
import AppSetting from '@/pages/setting/App'

export default function Setting() {
  return <PageTransition>
    <Box className='flex flex-col gap-4 pr-2'>
      <ThemeSetting />
      <Divider orientation='horizontal' flexItem variant='middle' />

      <MusicSetting />
      {/*<LyricSetting />*/}
      <AppSetting />
      {/*<WallhavenSetting />*/}
    </Box>
  </PageTransition>
}
