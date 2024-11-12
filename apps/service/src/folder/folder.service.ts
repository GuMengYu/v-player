import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Folder } from './folder.entity'
import { FileAccess } from '../utils/io/file-access'
import { SubfolderModel } from './subfolder-model'
import { FolderModel } from './folder-model'

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    private fileAccess: FileAccess,
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
  public async getSubfoldersAsync(rootFolder: FolderModel | undefined, subfolder: SubfolderModel | undefined): Promise<SubfolderModel[]> {
    // If no root folder is provided, return no subfolders.
    if (rootFolder == undefined) {
        return [];
    }

    const subfolders: SubfolderModel[] = [];
    let subfolderPaths: string[] = [];

    if (subfolder == undefined) {
        // If no subfolder is provided, return the subfolders of the root folder.
        try {
            if (this.fileAccess.pathExists(rootFolder.path)) {
                subfolderPaths = await this.fileAccess.getDirectoriesInDirectoryAsync(rootFolder.path);
            }
        } catch (e: unknown) {
           console.error(e, 'Could not get subfolderPaths for root folder', 'FolderService', 'getSubfoldersAsync');
        }
    } else {
        // If a subfolder is provided, return the subfolders of the subfolder.
        try {
            if (this.fileAccess.pathExists(subfolder.path)) {
                let subfolderPathToBrowse: string = subfolder.path;

                // If the ".." subfolder is selected, go to the parent folder.
                if (subfolder.isGoToParent) {
                    subfolderPathToBrowse = this.fileAccess.getDirectoryPath(subfolder.path);
                }

                // If we're not browsing the root folder, show a folder to go up 1 level.
                if (subfolderPathToBrowse !== rootFolder.path) {
                    subfolders.push(new SubfolderModel(subfolderPathToBrowse, true));
                }

                // Return the subfolders of the provided subfolder
                subfolderPaths = await this.fileAccess.getDirectoriesInDirectoryAsync(subfolderPathToBrowse);
            }
        } catch (e: unknown) {
           console.error(e, 'Could not get subfolderPaths for subfolder', 'FolderService', 'getSubfoldersAsync');
        }
    }

    for (const subfolderPath of subfolderPaths) {
        subfolders.push(new SubfolderModel(subfolderPath, false));
    }

    return subfolders;
  }
  public getSubfolderBreadcrumbs(rootFolder: FolderModel, subfolderPath: string): SubfolderModel[] {
    let parentFolderPath: string = subfolderPath;
    const subfolderBreadcrumbs: SubfolderModel[] = [];

    // Add subfolders, if applicable.
    while (parentFolderPath !== rootFolder.path) {
        console.info(
            `parentFolderPath=${parentFolderPath}, rootFolder.path=${rootFolder.path}`,
            'FolderService',
            'getSubfolderBreadcrumbs',
        );
        subfolderBreadcrumbs.push(new SubfolderModel(parentFolderPath, false));
        parentFolderPath = this.fileAccess.getDirectoryPath(parentFolderPath);
    }

    // Always add the root folder
    subfolderBreadcrumbs.push(new SubfolderModel(rootFolder.path, false));

    return subfolderBreadcrumbs.reverse();
  }
}
