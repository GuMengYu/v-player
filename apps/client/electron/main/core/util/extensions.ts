import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import is from 'electron-is'

import log from './log'

export async function installExtensions() {
  if (is.dev()) {
    // Install React Devtools
    try {
      await installExtension(REACT_DEVELOPER_TOOLS.id)
    }
    catch (e) {
      log.error('Vue Devtools failed to install:', e)
    }
  }
}
