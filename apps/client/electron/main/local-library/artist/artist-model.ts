import { Strings } from '../utils/strings'

export class ArtistModel {
  constructor(public name: string, public avatar?: string) {}

  public isSelected: boolean = false

  public get displayName(): string {
    if (Strings.isNullOrWhiteSpace(this.name))
      return 'Unknown Artist'

    return this.name
  }
}
