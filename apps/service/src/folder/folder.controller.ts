import { Controller, Post, Body, Get, Query } from '@nestjs/common'

import { FolderService } from './folder.service'
import * as os from 'node:os'
import * as nodePath from 'node:path'
import { FolderModel } from './folder-model'
import { Folder } from './folder.entity'
import { Desktop } from 'src/utils/desktop'
import { SubfolderModel } from './subfolder-model'

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService, private readonly desktop: Desktop) {
  }

  @Post('add-folder')
  public async addFolder(@Body('path') path: string) {
    await this.folderService.addFolderAsync(path)
  }

  @Get('all-folder')
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

  @Post('remove-folder')
  public async removeFolder(@Body('folderId') folderId: number) {
    try {
      await this.folderService.removeFolder(folderId)
    }
    catch (e) {

    }
  }
  @Get('get-folders')
  public async getFolders(@Query('path') path?: string) {

    console.log('get folders', path)

    const systemRoot = nodePath.parse(process.cwd()).root;

    const defaultPath = path ?? os.homedir()
    const folder = new Folder()
    folder.folderId = 0;
    folder.path = systemRoot
    
    const rootFolder = new FolderModel(folder)
    const subfolder = new SubfolderModel(defaultPath, false)

    return this.folderService.getSubfoldersAsync(rootFolder, subfolder)
  }
}
