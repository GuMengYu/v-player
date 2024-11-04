import {
  Scheme,
  Theme,
  argbFromHex,
  hexFromArgb,
  themeFromImage,
  themeFromSourceColor,
} from '@material/material-color-utilities'


export async function generateMUITheme(
  colorOrImage: string | HTMLImageElement,
  name: string,
) {
  let theme: Theme
  if (typeof colorOrImage === 'string')
    theme = await themeFromSourceColor(argbFromHex(colorOrImage))
  else
    theme = await themeFromImage(colorOrImage)

  const toHex = (scheme: Scheme) => {
    const map: any = {}
    for (const [key, value] of Object.entries(scheme.toJSON())) {
      if (!['background', 'onBackground'].includes(key)) {
        map[key] = {
          main: hexFromArgb(value),
        }
      }
    }
    return map
  }
  return {
    name,
    palette: {
      light: toHex(theme.schemes.light),
      dark: toHex(theme.schemes.dark),
    },
  }
}
