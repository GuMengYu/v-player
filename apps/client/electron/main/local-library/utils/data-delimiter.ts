import { isEmpty } from 'lodash'

export class DataDelimiter {
  private static delimiter: string = ';'
  private static doubleDelimiter: string = `${DataDelimiter.delimiter}${DataDelimiter.delimiter}`

  public static toDelimitedString(stringArray: string[]): string {
    if (!stringArray)
      return ''

    if (stringArray.length === 0)
      return ''

    const delimitedString: string = stringArray
      .filter(x => x !== '')
      .map(x => this.addDelimiters(x.trim()))
      .join('')

    return delimitedString
  }

  public static fromDelimitedString(delimitedString: string): string[] {
    if (isEmpty(delimitedString))
      return []

    const delimitedStrings: string[] = delimitedString.split(DataDelimiter.delimiter)

    return delimitedStrings.filter(x => x !== '').map(x => this.removeDelimiters(x))
  }

  private static addDelimiters(originalString: string): string {
    const delimitedString: string = `${this.delimiter}${originalString}${this.delimiter}`

    return delimitedString
  }

  private static removeDelimiters(delimitedString: string): string {
    const nonDelimitedString: string = delimitedString.split(this.delimiter).join('')

    return nonDelimitedString
  }
}
