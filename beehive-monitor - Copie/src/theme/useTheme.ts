import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'color-scheme';

export function useTheme() {
  const [dark, setDark] = useState(false);

  /* Read preference on startup */
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(KEY);
      if (stored) setDark(stored === 'dark');
    })();
  }, []);

  /* Switch and persist */
  const toggle = async () => {
    const next = !dark;
    setDark(next);
    await AsyncStorage.setItem(KEY, next ? 'dark' : 'light');
  };

  return { dark, toggle };
}
