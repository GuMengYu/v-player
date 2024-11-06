import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh_CN from './zh-CN.json'
import en_US from './en-US.json'
import { useSettingStore } from '@/store/setting'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    returnNull: false
    resources: {
      'en-US': typeof en_US
      'zh-CN': typeof zh_CN
    }
  }
}

export const supportedLanguages = ['zh-CN', 'en-US']
export type SupportedLanguage = (typeof supportedLanguages)[number]

export function getLocaleFromSetting() {
  const locale = useSettingStore.getState().locale
  if (supportedLanguages.includes(locale))
    return locale

  if (navigator.language.startsWith('zh-'))
    return 'zh-CN'

  return 'en-US'
}

i18n
  .use(initReactI18next)
  .init({
    returnNull: false,
    resources: {
      'en-US': { translation: en_US },
      'zh-CN': { translation: zh_CN },
    },
    lng: getLocaleFromSetting(),
    fallbackLng: 'en-US',
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
