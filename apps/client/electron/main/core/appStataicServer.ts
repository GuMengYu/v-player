import { join } from 'node:path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import polka from 'polka'
import sirv from 'sirv'

import log from './util/log'

export function useStaticServer() {
  log.info('static app create')
  const { VITE_API_SERVER_HOST, VITE_API_SERVER_PORT, VITE_CLIENT_PORT } = import.meta.env
  const assets = sirv(join(__dirname, '../../dist'))
  polka()
    .use(
      '/api',
      createProxyMiddleware({
        target: `http://${VITE_API_SERVER_HOST}:${VITE_API_SERVER_PORT}`,
        changeOrigin: true,
        pathRewrite: path => path.replace(/^\/api/, ''),
      }),
    )
    .use(assets)
    .listen(VITE_CLIENT_PORT, () => {
      log.info(`app run in port ${VITE_CLIENT_PORT}`)
    })
}
