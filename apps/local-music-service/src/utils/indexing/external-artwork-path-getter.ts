import { Injectable } from '@nestjs/common'
import { Strings } from '../strings'
import { Constants } from '../constant/constants'
import { FileAccess } from '../io/file-access'

@Injectable()
export class ExternalArtworkPathGetter {
  constructor(private fileAccess: FileAccess) {}

  public async getExternalArtworkPathAsync(audioFilePath: string): Promise<string> {
    if (Strings.isNullOrWhiteSpace(audioFilePath))
      return undefined

    const directory: string = this.fileAccess.getDirectoryPath(audioFilePath)
    const filesInDirectory: string[] = await this.fileAccess.getFilesInDirectoryAsync(directory)

    for (const filePath of filesInDirectory) {
      const fileName: string = this.fileAccess.getFileName(filePath)

      if (Constants.externalCoverArtPatterns.includes(fileName.toLowerCase()))
        return filePath

      const fileNameWithoutExtension: string = this.fileAccess.getFileNameWithoutExtension(filePath)

      for (const externalCoverArtPattern of Constants.externalCoverArtPatterns) {
        const externalCoverArtPatternReplacedByFileName: string = Strings.replaceAll(
          externalCoverArtPattern,
          '%filename%',
          fileNameWithoutExtension,
        )

        if (fileName.toLowerCase() === externalCoverArtPatternReplacedByFileName.toLowerCase())
          return filePath
      }
    }

    return undefined
  }
}
