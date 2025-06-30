import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const KEY_SEL  = 'currentHive';
const KEY_LIST = 'joinedHives';

type HiveLite = { id: string; name: string };

export function useHiveSession() {
  const [hiveId, setHiveId]   = useState<string | null>(null);
  const [hives,  setHives]    = useState<HiveLite[]>([]);
  const [loading, setLoading] = useState(true);

  /* --------- bootstrap : AsyncStorage puis fallback requête SQL --------- */
  useEffect(() => {
    (async () => {
      const savedId   = await AsyncStorage.getItem(KEY_SEL);
      const cachedStr = await AsyncStorage.getItem(KEY_LIST);

      if (savedId)   setHiveId(savedId);
      if (cachedStr) setHives(JSON.parse(cachedStr));

      /* si pas de cache, on récupère en base (RLS filtre déjà) */
      if (!cachedStr) {
        const { data } = await supabase
          .from('hives')
          .select('id, name')
          .order('name');
        setHives(data ?? []);
        await AsyncStorage.setItem(KEY_LIST, JSON.stringify(data ?? []));
      }
      setLoading(false);
    })();
  }, []);

  /* ------------------------------ login ------------------------------ */
  const login = async (code: string, pwd: string): Promise<string> => {
    const { data: id, error } = await supabase.rpc<string>('login_hive', {
      p_code: code.trim(),
      p_pwd : pwd,
    });
    if (error) throw error;

    /* ajoute la ruche dans la liste si absente */
    if (!hives.some(h => h.id === id)) {
      const newEntry = { id, name: code.trim() };      // nom provisoire
      const next     = [...hives, newEntry].sort((a,b)=>a.name.localeCompare(b.name));
      setHives(next);
      await AsyncStorage.setItem(KEY_LIST, JSON.stringify(next));
    }

    await AsyncStorage.setItem(KEY_SEL, id);
    setHiveId(id);
    return id;
  };

  /* ------------------------------ logout ----------------------------- */
  const logout = async () => {
    await AsyncStorage.removeItem(KEY_SEL);
    setHiveId(null);
  };

  const addOrUpdateHive = (h: HiveLite) => {
  setHives(prev => {
    const next = [...prev.filter(x => x.id !== h.id), h]
      .sort((a, b) => a.name.localeCompare(b.name));
    AsyncStorage.setItem(KEY_LIST, JSON.stringify(next));
    return next;
  });
};

const removeHive = (id: string) => {
  setHives(prev => {
    const next = prev.filter(h => h.id !== id);
    AsyncStorage.setItem(KEY_LIST, JSON.stringify(next));
    /* si on vient de supprimer la ruche sélectionnée */
    if (id === hiveId) {
      const fallback = next[0]?.id ?? null;
      setHiveId(fallback);
      AsyncStorage.setItem(KEY_SEL, fallback ?? '');
    }
    return next;
  });
};

const selectHive = async (id: string | null) => {
        setHiveId(id); // Met à jour l'état pour un rafraîchissement immédiat de l'UI
        if (id) {
            await AsyncStorage.setItem(KEY_SEL, id); // Persiste la sélection
        } else {
            await AsyncStorage.removeItem(KEY_SEL);
        }
    };

return { hiveId, hives, loading, login, logout, addOrUpdateHive, removeHive, selectHive };
}
