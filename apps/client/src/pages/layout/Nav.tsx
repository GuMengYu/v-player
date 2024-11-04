import { Link as RouterLink, useLocation } from 'react-router-dom'
import type { CSSObject, Theme } from '@mui/material/styles'
import { styled, useTheme } from '@mui/material/styles'

// mui components
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'

// icons
import CategoryIcon from '@mui/icons-material/Category'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import HomeIcon from '@mui/icons-material/Home'
import PublicIcon from '@mui/icons-material/Public'
import ComputerIcon from '@mui/icons-material/Computer'

// components
import PodcastsIcon from '@mui/icons-material/Podcasts'
import MenuToggle from '@/components/toggle/MenuToggle'

// hooks
import { useAppStore } from '@/store/app'
import AggregateExtendButton from '@/components/button/AggregateExtendButton'
import useUser from '@/hooks/useUser'

const drawerWidth = 256

function openedMixin(theme: Theme): CSSObject {
  return {
    position: 'static',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: 'cubic-bezier(0.55, -0.01, 0, 1.03)',
      duration: theme.transitions.duration.complex,
    }),
    overflowX: 'hidden',
    borderRight: 'none',
    background: theme.palette.surfaceVariant.main,
  }
}

function closedMixin(theme: Theme): CSSObject {
  return {
    position: 'static',
    transition: theme.transitions.create('width', {
      easing: 'cubic-bezier(0.55, -0.01, 0, 1.03)',
      duration: theme.transitions.duration.complex,
    }),
    overflowX: 'hidden',
    width: theme.spacing(9),
    borderRight: 'none',
    background: theme.palette.surface.main,
  }
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

export default function MiniDrawer() {
  const theme = useTheme()
  const { rail: open } = useAppStore()
  const { logged } = useUser()
  const { pathname } = useLocation()
  const list = [
    {
      icon: <HomeIcon sx={{ height: 20, width: 20 }} />,
      val: 'home',
      title: '主页',
      to: '/home',
      pathname: ['/home', '/'],
    },
    {
      icon: <PublicIcon sx={{ height: 20, width: 20 }} />,
      val: 'explore',
      title: '浏览',
      to: '/explore',
      pathname: ['/explore'],
    },
    {
      icon: <PodcastsIcon sx={{ height: 20, width: 20 }} />,
      val: 'podcast_center',
      title: '播客',
      to: '/podcast_center',
      pathname: ['/podcast_center'],
    },
    ...(logged
      ? [{
          icon: <CategoryIcon sx={{ height: 20, width: 20 }} />,
          val: 'library',
          title: '资料库',
          to: '/library',
          pathname: ['/library'],
        }]
      : [] ),
    {
      icon: <ComputerIcon sx={{ height: 20, width: 20 }} />,
      val: 'local-library',
      title: '本地音乐库',
      to: '/local-library/tracks',
      pathname: ['/local-library', '/local-library/tracks', '/local-library/artist', '/local-library/playlist', '/local-library/album'],
    },
  ]

  return (
    <Drawer variant="permanent" open={open} className="drag-area" sx={{
      gridArea: 'left-nav',
    }}>
      <Box sx={{ mt: 2.65, mx: 2.2, mb: 2.75 }}>
        <MenuToggle />
      </Box>
      {open
        ? (
            ''
          )
        : (
        <Box sx={{ mx: 1.5 }}>
          <AggregateExtendButton />
        </Box>
          )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
        }}
      >
        <List
          sx={{
            pt: 0,
            mx: 1,
            flex: open ? '' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            transition: 'flex 350ms cubic-bezier(0.55, -0.01, 0, 1.03)',
          }}
        >
          {/* <ListItem */}
          {/*  disablePadding */}
          {/*  sx={{ display: 'block', mb: 0.5 }} */}
          {/*  className="no-drag-area" */}
          {/*  onClick={() => { */}
          {/*    toggleSearch() */}
          {/*  }} */}
          {/* > */}
          {/*  <ListItemButton */}
          {/*    selected={showSearch } */}
          {/*    sx={{ */}
          {/*      borderRadius: 14, */}
          {/*      minHeight: 56, */}
          {/*      justifyContent: open ? 'initial' : 'center', */}
          {/*      px: 1, */}
          {/*    }} */}
          {/*  > */}
          {/*    <ListItemIcon */}
          {/*      sx={{ */}
          {/*        minWidth: 40, */}
          {/*        minHeight: 40, */}
          {/*        justifyContent: 'center', */}
          {/*        alignItems: 'center', */}
          {/*        color: theme.palette.primary.main, */}
          {/*      }} */}
          {/*    > */}
          {/*      <SearchIcon sx={{ height: 20, width: 20 }} /> */}
          {/*    </ListItemIcon> */}
          {/*    <ListItemText */}
          {/*      secondary='搜索' */}
          {/*      sx={{ opacity: open ? 1 : 0 }} */}
          {/*    /> */}
          {/*  </ListItemButton> */}
          {/* </ListItem> */}
          {list.map((item, index) => (
            <ListItem
              key={item.val}
              disablePadding
              sx={{ display: 'block', mb: 0.5 }}
              className="no-drag-area"

            >
              <Link component={RouterLink} to={item.to}>
                <ListItemButton
                  selected={item.pathname.includes(pathname)}
                  sx={{
                    borderRadius: 14,
                    minHeight: 56,
                    justifyContent: open ? 'initial' : 'center',
                    px: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      minHeight: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    secondary={item.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        {open
          ? (
              ''
            )
          : (
          <Box
            className="no-drag-area"
            sx={{
              pb: 2,
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {/* <Account /> */}
            {/* <DarkModeToggle /> */}
          </Box>
            )}
      </Box>
    </Drawer>
  )
}
