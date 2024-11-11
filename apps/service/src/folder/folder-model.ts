import { Folder } from './folder.entity';

export class FolderModel {
    public constructor(private folder: Folder) {}

    public get folderId(): number {
        return this.folder.folderId;
    }

    public get path(): string {
        return this.folder.path;
    }
}
