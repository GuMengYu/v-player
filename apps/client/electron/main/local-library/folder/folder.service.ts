import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Folder } from './folder.entity'

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
  ) {
  }

  async addFolderAsync(path: string) {
    const exist = await this.folderRepository.findBy({ path })
    // 不存在则添加
    if (!exist.length) {
      const newFolder = new Folder()
      newFolder.path = path
      await this.folderRepository.manager.save(newFolder)
      console.log('新增加了folder', newFolder.path)
    }
    else {
      console.log('文件夹已存在')
    }
  }

  async getFolders() {
    return await this.folderRepository.findAndCount()
  }

  async removeFolder(folderId: number) {
    await this.folderRepository
      .createQueryBuilder('folder')
      .delete()
      .from(Folder)
      .where('folderId = :folderId', { folderId })
      .execute()
  }
}
