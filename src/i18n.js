import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['de', 'en'],
    fallbackLng: 'de',
    debug: false,
    detection: {
      order: ['cookie', 'htmlTag', 'path'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/localization/{{lng}}/translation.json',
    },
  });

export default i18n