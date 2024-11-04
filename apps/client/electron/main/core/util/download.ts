import { unlink } from 'node:fs'
import { join } from 'node:path'
import { app } from 'electron'
import type { File } from 'electron-dl'
import { download } from 'electron-dl'
import NodeID3 from 'node-id3'

import type { Tags } from '@shared/types'
import { getWin } from '../../index'
import { isFlacFile, isMP3File, isMutagenInstalled, isPythonInstalled, runPythonScript } from './fn'
import log from './log'

export function downloadFile(data: { fileName?: string; url: string; completed?: (file: File) => void }) {
  const win = getWin()
  const downloadLocation = app.getPath('downloads')
  const fileName = data.fileName || data.url.split('/').pop()
  if (win) {
    download(win, data.url, {
      directory: downloadLocation,
      showBadge: false,
      filename: fileName,
      onStarted(item) {
        log.info('download file start', fileName)
        win.webContents.send('startDownload', { name: item.getFilename() })
      },
      onProgress(progress) {
        progress.percent = (progress.transferredBytes / progress.totalBytes) * 100
        win.webContents.send('downloadProgress', progress)
        log.info('download file progress', progress)
      },
      onCompleted(file) {
        win.webContents.send('downloadCompleted', { ...file, dir: downloadLocation }, fileName)
        log.info('download file completed', file)
        if (data.completed)
          data.completed(file)
      },
    })
  }
  else {
    log.warn('not found window')
  }
}

export async function downloadTrack(data: { fileName?: string; url: string; tags: Tags }) {
  const { fileName, url, tags } = data
  const { cover } = tags
  tags.APIC = await getSongArtworkPath(cover)
  downloadFile({
    fileName,
    url,
    completed: (file) => {
      const { path } = file
      if (isMP3File(path))
        updateId3Tags(tags, path)

      if (isFlacFile(path))
        updateVorbis(tags, path)
    },
  })
}

async function getSongArtworkPath(url: string) {
  const win = getWin()
  const tempDirectory = join(app.getPath('userData'), 'temp')
  if (win) {
    const downloadItem = await download(win, url, {
      directory: tempDirectory,
      showBadge: false,
    })
    const coverPath = downloadItem.getSavePath()
    log.info('download artwork temp file', coverPath)
    return coverPath
  }
}

/**
 * update mp3 file metadata
 * @param tags
 * @param path
 */
async function updateId3Tags(tags: Tags, path: string) {
  NodeID3.write(tags, path)
  removeTempArtworkPicture(tags.APIC)
}

function removeTempArtworkPicture(path: string) {
  // remove temp artwork file
  unlink(path, () => {
    log.info('remove artwork temp file', path)
  })
}

/**
 * update flac lossless file metadata
 */
async function updateVorbis(tags: Tags, path: string) {
  // todo
  const py = join(__dirname, '../../dist', 'edit_flac_metadata.py')
  const pythonInstalled = await isPythonInstalled()
  if (pythonInstalled) {
    const mutagenInstalled = await isMutagenInstalled()
    if (mutagenInstalled) {
      log.info('[main] update flac metadata output')
      try {
        const output = await runPythonScript(py, [
          path,
          '--image',
          tags.APIC,
          '--title',
          tags.title,
          '--album',
          tags.album,
          '--artist',
          tags.artist,
        ])
        log.info('[main] update flac metadata output', output)
        removeTempArtworkPicture(tags.APIC)
      }
      catch (e) {
        log.error('[main]: update flac metadata error', e)
      }
    }
    else {
      log.info('[main] update flac metadata mutagen no installed')
    }
  }
  else {
    log.info('[main] update flac metadata python no installed')
  }
}
