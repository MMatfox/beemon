import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import fr from './fr.json';
import vi from './vi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, fr: { translation: fr }, vi: { translation: vi } },
    lng: Localization.locale.split('-')[0],
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
