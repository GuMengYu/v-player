import { exec, spawn } from 'node:child_process'
import { extname } from 'node:path'

/**
 * 判断文件是否为 MP3 文件
 * @param {string} filePath - 文件路径
 * @returns {boolean} 是否为 MP3 文件
 */
export function isMP3File(filePath: string) {
  const extName = extname(filePath)
  return extName === '.mp3' || extName === '.m4a'
}

export function isFlacFile(filePath: string) {
  const extName = extname(filePath)
  return extName === '.flac'
}

/**
 * 检查 Python 是否已安装
 * @returns {Promise<boolean>} - Promise 对象，表示 Python 是否已安装
 */
export function isPythonInstalled() {
  return new Promise((resolve) => {
    exec('python --version', (error) => {
      if (error)
        resolve(false)
      else
        resolve(true)
    })
  })
}

// 检查Mutagen库是否安装
export function isMutagenInstalled() {
  return new Promise((resolve) => {
    exec('python -c "import mutagen"', (err, stdout, stderr) => {
      if (err)
        resolve(false)

      resolve(true)
    })
  })
}

export function runPythonScript(scriptPath: string, args: any) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [scriptPath, ...args])

    let output = ''

    python.stdout.on('data', (data) => {
      output += data.toString()
    })
    python.stderr.on('data', (data) => {
      console.error(data.toString())
    })
    python.on('close', (code) => {
      if (code === 0)
        resolve(output)
      else
        reject(new Error(`Python script exited with code ${code}`))
    })
    python.on('error', reject)
  })
}
