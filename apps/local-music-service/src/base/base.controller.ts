import { Controller, Post } from '@nestjs/common'

import { FileAccess } from '../utils/io/file-access'
import { IndexingService } from '../utils/indexing/indexing.service'
import { Desktop } from '../utils/desktop'

@Controller('base')
export class BaseController {
  constructor(private readonly fileAccess: FileAccess, private readonly indexingService: IndexingService, private readonly desktop: Desktop) {}
  @Post('get-files')
  async getFiles(path: string) {
    const res = await this.fileAccess.getFilesInDirectoryAsync(path)
    console.log(res)
  }

  @Post('indexing')
  async indexing() {
    this.indexingService.indexCollectionAlwaysAsync()
  }

  @Post('open-path')
  async openPath(path: string) {
    this.desktop.openPath(path)
  }

  @Post('show-file-in-dir')
  async showFileInDirectory(path: string) {
    this.desktop.showFileInDirectory(path)
  }
}
