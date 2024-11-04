import {
  // createBrowserRouter,
  createHashRouter,
} from 'react-router-dom'

import type { ReactNode } from 'react'
import { Suspense } from 'react'
import App from './App'

import Home from './pages/Home'
import Library from './pages/Library'
import LocalLibrary from './pages/local/LocalLibrary'

import NotFound from './pages/NotFound'
import Search from './pages/Search'
import PlaylistPage from './pages/detail/Playlist'
import { getPlaylistDetail } from './api/playlist'
import Playground from '@/pages/Playground'
import Setting from '@/pages/setting/Setting'
import LocalAlbumPage from '@/pages/local/components/Album'
import AlbumPage from '@/pages/detail/Album'
import ArtistPage from '@/pages/detail/Artist'
import DailyPage from '@/pages/Daily'
import WallpaperPage from '@/pages/Wallpaper'
import VideoPage from '@/pages/detail/Video'
import ExplorePage from '@/pages/explore/Explore'
import MoodsGenresPage from '@/pages/explore/MoodsGenres'
import MoodsGenresDetail from '@/pages/detail/MoodsGenresDetail'
import ListCollection from '@/pages/detail/ListCollection'
import CloudPage from '@/pages/cloud/Cloud'
import ListenRank from '@/pages/listen-rank/ListenRank'
import Recent from '@/pages/recent/Recent'
import PodcastCenter from '@/pages/podcast/PodcastCenter'
import PodcastDetail from '@/pages/detail/Podcast'
import MyPodcast from '@/pages/podcast/MyPodcast'
import PodcastGenresDetail from '@/pages/detail/PodcastGenresDetail'
import Minimal from '@/Minimal'
import LocalSetting from '@/pages/setting/Local'
import LocalArtistPage from '@/pages/local/components/Artist'
import LocalPlaylistPage from '@/pages/local/components/Playlist'
import LocalLikedPage from '@/pages/local/components/Liked'

function lazyLoad(component: ReactNode) {
  return <Suspense>{component}</Suspense>
}

function playlistDetailQuery(id: number) {
  return {
    queryKey: ['playlist', 'detail', id],
    queryFn: async () => getPlaylistDetail(id),
  }
}

const router = createHashRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          id: 'redirect_home',
          path: '/',
          element: <Home />,
        },
        {
          id: 'home',
          path: '/home',
          element: <Home />,
        },
        {
          id: 'explore',
          path: '/explore',
          element: <ExplorePage />,
        },
        {
          id: 'moods_and_genres',
          path: '/moods_and_genres',
          element: <MoodsGenresPage />,
        },
        {
          id: 'moods_and_genres_detail',
          path: '/moods_and_genres/:type',
          element: <MoodsGenresDetail />,
        },
        {
          id: 'list_collection',
          path: '/list_collection/:type',
          element: <ListCollection />,
        },
        {
          id: 'daily',
          path: '/daily',
          element: <DailyPage />,
        },
        {
          id: 'library',
          path: '/library',
          element: <Library />,
        },
        {
          id: 'playlist',
          path: '/playlist/:id',
          element: <PlaylistPage />,
        },
        {
          id: 'album',
          path: '/album/:id',
          element: <AlbumPage />,
        }, {
          id: 'artist',
          path: '/artist/:id',
          element: <ArtistPage />,
        },
        {
          id: 'video',
          path: '/video/:id',
          element: <VideoPage/>,
        },
        {
          id: 'podcast_center',
          path: '/podcast_center',
          element: <PodcastCenter />,
        },
        {
          id: 'podcast_detail',
          path: '/podcast/:id',
          element: <PodcastDetail />,
        },
        {
          id: 'podcast_genres',
          path: '/podcast_genres/:categoryName/:categoryId',
          element: <PodcastGenresDetail />,
        },
        {
          id: 'cloud',
          path: '/cloud',
          element: <CloudPage/>,
        },
        {
          id: 'my_podcast',
          path: '/my_podcast',
          element: <MyPodcast />,
        },
        {
          id: 'rank',
          path: '/rank',
          element: <ListenRank/>,
        },
        {
          id: 'recent',
          path: '/recent',
          element: <Recent />,
        },
        {
          id: 'setting',
          path: '/setting',
          element: <Setting />,
        },
        {
          id: 'search',
          path: '/search',
          element: <Search />,
        },
        {
          id: 'playground',
          path: '/playground',
          element: <Playground/>,
        },
        {
          id: 'local-library',
          path: '/local-library/:type',
          element: <LocalLibrary />,
        },
        {
          id: 'local-album',
          path: '/local/album/:id?',
          element: <LocalAlbumPage />,
        },
        {
          id: 'local-artist',
          path: '/local/artist/:name?',
          element: <LocalArtistPage />,
        },
        {
          id: 'local-playlist',
          path: '/local/playlist/:id?',
          element: <LocalPlaylistPage />,
        },
        {
          id: 'local-setting',
          path: '/local/setting',
          element: <LocalSetting />,
        },
        {
          id: 'local-liked',
          path: '/local/liked',
          element: <LocalLikedPage />,
        },
        {
          id: 'wallpaper',
          path: '/wallpaper',
          element: <WallpaperPage/>,
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
    {
      path: '/minimal',
      element: <Minimal />,
    },
  ],
  // createRoutesFromElements(
  //   <Route path='/' element={lazyLoad(<App />)}>
  //     <Route path='/home' element={lazyLoad(<Home />)} />
  //     <Route path='/library' element={lazyLoad(<Library />)} />

  //     {/* <Route
  //       path='/flow/:id'
  //       element={lazyLoad(<FlowDetail />)}
  //       loader={async ({ params }) => {
  //         if (params.id) {
  //           const { data } = await fetchFlow(params.id)
  //           return data
  //         }
  //       }}
  //     /> */}
  //     {/* <Route path='/settings' element={lazyLoad(<Setting />)} /> */}
  //     <Route path='/search' element={lazyLoad(<Search />)} />
  //     <Route path='*' element={lazyLoad(<NotFound/>)} />
  //   </Route>
  // )
)
export default router
