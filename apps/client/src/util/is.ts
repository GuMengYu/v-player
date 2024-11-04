function isElectron() {
  // Renderer process
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer')
    return true

  // Main process
  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron)
    return true

  // Detect the user agent when the `nodeIntegration` option is set to false
  return typeof navigator === 'object' && navigator.userAgent.includes('Electron')
}
export default {
  electron: isElectron,
  macOS: () => {
    return isElectron() && process.platform === 'darwin'
  },
  windows: () => {
    return isElectron() && process.platform === 'win32'
  },
  linux: () => {
    return isElectron() && process.platform === 'linux'
  },
  renderer: () => {
    return isElectron() && process.type === 'renderer'
  },
  // Checks if we are in main process
  main: () => {
    return isElectron() && process.type === 'browser'
  },
}
