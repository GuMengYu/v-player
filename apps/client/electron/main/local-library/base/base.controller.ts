import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { FileAccess } from '../utils/io/file-access'
import { IndexingService } from '../utils/indexing/indexing.service'
import { Desktop } from '../utils/desktop'

@Controller('base')
export class BaseController {
  constructor(private readonly fileAccess: FileAccess, private readonly indexingService: IndexingService, private readonly desktop: Desktop) {}
  @IpcHandle('get-files')
  async getFiles(path: string) {
    const res = await this.fileAccess.getFilesInDirectoryAsync(path)
    console.log(res)
  }

  @IpcHandle('indexing')
  async indexing() {
    this.indexingService.indexCollectionAlwaysAsync()
  }

  @IpcHandle('open-path')
  async openPath(path: string) {
    this.desktop.openPath(path)
  }

  @IpcHandle('show-file-in-dir')
  async showFileInDirectory(path: string) {
    this.desktop.showFileInDirectory(path)
  }
}
