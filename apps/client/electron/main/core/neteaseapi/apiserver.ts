// import { resolve } from 'path'
// const outerModule = resolve(__dirname, '../../../NeteaseCloudMusicApi')
import netEaseApi from 'NeteaseCloudMusicApi'

// const netEaseApi = require('NeteaseCloudMusicApi')

export async function useNetEaseApiServer(options = {
  port: 12141,
  host: '127.0.0.1',
}) {
  return await netEaseApi.serveNcmApi(options)
}
