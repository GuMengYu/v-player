import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { FolderService } from './folder.service'

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {
  }

  @IpcHandle('folder-msg')
  public hello() {
    console.log('hello from folder')
  }

  @IpcHandle('add-folder')
  public async addFolder(path: string) {
    await this.folderService.addFolderAsync(path)
  }

  @IpcHandle('all-folder')
  public async getAllFolder() {
    try {
      const [folders, count] = await this.folderService.getFolders()
      return {
        folders,
        count,
      }
    }
    catch (e) {
      console.log('出错了')
    }
  }

  @IpcHandle('remove-folder')
  public async removeFolder(folderId: number) {
    try {
      await this.folderService.removeFolder(folderId)
    }
    catch (e) {

    }
  }
}
