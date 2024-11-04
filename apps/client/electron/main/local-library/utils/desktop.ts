import { Injectable } from '@nestjs/common'
import { OpenDialogReturnValue, app, dialog, nativeTheme, shell, systemPreferences } from 'electron'
import { Observable, Subject } from 'rxjs'
import { BaseDesktop } from './base-desktop'

@Injectable()
export class Desktop implements BaseDesktop {
  private accentColorChanged: Subject<void> = new Subject()
  private nativeThemeUpdated: Subject<void> = new Subject()

  constructor() {
    if (systemPreferences !== undefined)
      systemPreferences.on('accent-color-changed', () => this.accentColorChanged.next())

    if (nativeTheme !== undefined)
      nativeTheme.on('updated', () => this.nativeThemeUpdated.next())
  }

  public accentColorChanged$: Observable<void> = this.accentColorChanged.asObservable()
  public nativeThemeUpdated$: Observable<void> = this.nativeThemeUpdated.asObservable()

  public async showSelectFolderDialogAsync(dialogTitle: string): Promise<string> {
    const openDialogReturnValue: OpenDialogReturnValue = await dialog.showOpenDialog({
      title: dialogTitle,
      properties: ['openDirectory'],
    })

    if (
      openDialogReturnValue !== undefined
            && openDialogReturnValue.filePaths !== undefined
            && openDialogReturnValue.filePaths.length > 0
    )
      return openDialogReturnValue.filePaths[0]

    return ''
  }

  public async showSelectFileDialogAsync(dialogTitle: string): Promise<string> {
    const openDialogReturnValue: OpenDialogReturnValue = await dialog.showOpenDialog({
      title: dialogTitle,
      properties: ['openFile'],
    })

    if (
      openDialogReturnValue !== undefined
            && openDialogReturnValue.filePaths !== undefined
            && openDialogReturnValue.filePaths.length > 0
    )
      return openDialogReturnValue.filePaths[0]

    return ''
  }

  public openLink(url: string): void {
    shell.openExternal(url)
  }

  public openPath(path: string): void {
    shell.openPath(path)
  }

  public showFileInDirectory(filePath: string): void {
    shell.showItemInFolder(filePath)
  }

  public shouldUseDarkColors(): boolean {
    return nativeTheme.shouldUseDarkColors
  }

  public getAccentColor(): string {
    return systemPreferences.getAccentColor()
  }

  public async moveFileToTrashAsync(filePath: string): Promise<void> {
    await shell.trashItem(filePath)
  }

  public getMusicDirectory(): string {
    return app.getPath('music')
  }

  public getApplicationDataDirectory(): string {
    return app.getPath('userData')
  }
}
