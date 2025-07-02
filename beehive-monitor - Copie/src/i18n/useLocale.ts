import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import i18n from 'i18next';

const KEY = 'locale';

export function useLocale() {
  const [locale, setLocale] = useState(i18n.language);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(KEY);
      if (stored && stored !== locale) {
        i18n.changeLanguage(stored);
        setLocale(stored);
      }
    })();
  }, []);

  const change = async (lang: string) => {
    await i18n.changeLanguage(lang);
    setLocale(lang);
    await SecureStore.setItemAsync(KEY, lang);
  };

  return { locale, change };
}
