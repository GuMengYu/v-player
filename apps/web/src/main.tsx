import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import 'overlayscrollbars/overlayscrollbars.css'
import bootstrap from '@/store/bootstrap'
import './i18n/i18n'
import { useFonts } from '@/plugins/fonts'

bootstrap()
useFonts()
// import './samples/node-api'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>,
  // </React.StrictMode>,
)
postMessage({ payload: 'removeLoading' }, '*')
