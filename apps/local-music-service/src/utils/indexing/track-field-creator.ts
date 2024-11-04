import { Injectable } from '@nestjs/common'
import { MetadataPatcher } from '../metadata/metadata-patcher'
import { DataDelimiter } from '../data-delimiter'

@Injectable()
export class TrackFieldCreator {
  constructor(private metadataPatcher: MetadataPatcher) {}

  public createNumberField(value: number): number {
    if (!value || Number.isNaN(value))
      return 0

    return value
  }

  public createTextField(value: string): string {
    if (!value)
      return ''

    return value.trim()
  }

  public createMultiTextField(valueArray: string[]): string {
    if (!valueArray)
      return ''

    return DataDelimiter.toDelimitedString(this.metadataPatcher.joinUnsplittableMetadata(valueArray))
  }
}
