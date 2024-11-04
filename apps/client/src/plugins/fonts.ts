/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */
import webFontLoader from 'webfontloader'

export function useFonts() {
  webFontLoader.load({
    classes: false,
    google: {
      // families: ['Roboto:100,300,400,500,700,900&display=swap'],

      families: ['Noto Sans SC:100,200,300,400,500,600,700,900&display=swap', 'Quicksand:100,200,300,400,500,600,700,900&display=swap'],
    },
  })
}
