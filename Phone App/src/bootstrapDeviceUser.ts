import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabaseClient';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

const KEY_EMAIL = 'device_email';
const KEY_PASS  = 'device_pass';

export async function ensureDeviceUser() {
  let email = await SecureStore.getItemAsync(KEY_EMAIL);
  let pass  = await SecureStore.getItemAsync(KEY_PASS);

  if (!email || !pass) {
    /* 1ère ouverture – on crée un compte “fantôme” */
    email = `${uuid()}@device.local`;
    pass  = uuid();

    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { emailRedirectTo: undefined }   // pas de magic-link
    });
    if (signUpErr) throw signUpErr;

    await SecureStore.setItemAsync(KEY_EMAIL, email);
    await SecureStore.setItemAsync(KEY_PASS,  pass);
  } else {
    /* L’appareil possède déjà ses identifiants */
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (signInErr) throw signInErr;
  }
}
