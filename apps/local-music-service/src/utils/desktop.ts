import { Injectable } from '@nestjs/common'
import { exec } from 'child_process'
import * as path from 'path'
import * as os from 'os'

@Injectable()
export class Desktop {

  constructor() {}

  // 打开链接，使用系统默认浏览器
  public openLink(url: string): void {
    const startCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open'
    exec(`${startCommand} ${url}`)
  }

  // 打开指定路径
  public openPath(targetPath: string): void {
    const openCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open'
    exec(`${openCommand} ${targetPath}`)
  }

  // 在文件夹中显示文件
  public showFileInDirectory(filePath: string): void {
    const directory = path.dirname(filePath)
    this.openPath(directory)
  }

  // 将文件移至系统垃圾桶
  public async moveFileToTrashAsync(filePath: string): Promise<void> {
    const trashCommand = process.platform === 'win32' ? 'del' : process.platform === 'darwin' ? 'mv' : 'trash'
    exec(`${trashCommand} ${filePath}`)
  }

  // 获取音乐目录
  public getMusicDirectory(): string {
    return path.join(os.homedir(), 'Music')
  }

  // 获取应用数据目录
  public getApplicationDataDirectory(): string {
    return path.join(os.homedir(), process.platform === 'win32' ? 'AppData\\Roaming\\music-you' : 'music-you')
  }
}