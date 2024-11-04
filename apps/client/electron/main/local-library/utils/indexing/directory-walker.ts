import { Injectable } from '@nestjs/common'
import { FileAccess } from '../io/file-access'
import { DirectoryWalkResult } from './directory-walk-result'

@Injectable()
export class DirectoryWalker {
  constructor(private fileAccess: FileAccess) {}

  public async getFilesInDirectoryAsync(directoryPath: string): Promise<DirectoryWalkResult> {
    const filePaths: string[] = []
    const errors: Error[] = []

    await this.recursivelyGetFilesInDirectoryAsync(directoryPath, filePaths, errors)

    return new DirectoryWalkResult(filePaths, errors)
  }

  private async recursivelyGetFilesInDirectoryAsync(directoryPath: string, filePaths: string[], errors: Error[]): Promise<void> {
    try {
      // Process the files found in the directory
      let filePathsInDirectory: string[]

      try {
        filePathsInDirectory = await this.fileAccess.getFilesInDirectoryAsync(directoryPath, true, errors)
      }
      catch (e: any) {
        errors.push(e)
      }

      if (filePathsInDirectory && filePathsInDirectory.length > 0) {
        for (const filePath of filePathsInDirectory) {
          try {
            filePaths.push(filePath)
          }
          catch (e: any) {
            errors.push(e)
          }
        }
      }

      // Recurse into subdirectories in this directory
      let subdirectoryPathsInDirectory: string[]

      try {
        subdirectoryPathsInDirectory = await this.fileAccess.getDirectoriesInDirectoryAsync(directoryPath, true, errors)
      }
      catch (e: any) {
        errors.push(e)
      }

      if (subdirectoryPathsInDirectory && subdirectoryPathsInDirectory.length > 0) {
        for (const subdirectoryPath of subdirectoryPathsInDirectory) {
          try {
            await this.recursivelyGetFilesInDirectoryAsync(subdirectoryPath, filePaths, errors)
          }
          catch (e: any) {
            errors.push(e)
          }
        }
      }
    }
    catch (e: any) {
      errors.push(e)
    }
  }
}
