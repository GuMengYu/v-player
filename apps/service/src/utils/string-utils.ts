import { Constants } from './constant/constants'

export class StringUtils {
  public static get empty(): string {
    return ''
  }

  public static equalsIgnoreCase(string1: string | undefined, string2: string | undefined): boolean {
    if (!string1 && !string2)
      return true


    if (!string1)
      return false


    if (!string2)
      return false


    return string1.toLowerCase() === string2.toLowerCase()
  }

  public static isNullOrWhiteSpace(stringToCheck: string | undefined): boolean {
    if (!stringToCheck)
      return true


    try {
      if (stringToCheck.trim() === '')
        return true

    }
    catch (e: unknown) {
      return true
    }

    return false
  }

  public static replaceFirst(sourceString: string, oldValue: string, newValue: string): string {
    return sourceString.replace(oldValue, newValue)
  }

  public static replaceAll(sourceString: string, oldValue: string, newValue: string): string {
    return sourceString.split(oldValue).join(newValue)
  }

  public static removeAccents(stringWithAccents: string): string {
    return stringWithAccents.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
  }

  public static getSortableString(originalString: string | undefined, removePrefixes: boolean): string {
    if (this.isNullOrWhiteSpace(originalString))
      return ''


    try {
      const trimmedAndLowerCasedOriginalString: string = originalString!.trim().toLowerCase()

      if (!removePrefixes)
        return trimmedAndLowerCasedOriginalString


      for (const removablePrefix of Constants.removablePrefixes) {
        const prefixFollowedBySpace: string = `${removablePrefix} `

        if (trimmedAndLowerCasedOriginalString.startsWith(prefixFollowedBySpace))
          return trimmedAndLowerCasedOriginalString.replace(prefixFollowedBySpace, '').trim()

      }
    }
    catch (e: unknown) {
      // Ignore this error
    }

    return originalString!.toLowerCase()
  }
}
