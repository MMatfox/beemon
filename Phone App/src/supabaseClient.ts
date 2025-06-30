// Polyfills the WHATWG URL API (required by Supabase's internals in React Native
// because the native runtime doesn't implement the full browser API surface).
import 'react-native-url-polyfill/auto';

// Factory for creating a Supabase client instance.
import { createClient } from '@supabase/supabase-js';

// Cross-platform WebSocket implementation.  
// React Native's global 'WebSocket' sometimes lacks features that Supabase's
// realtime service expects, so we inject 'isomorphic-ws' instead.
import ws from 'isomorphic-ws';
/**
 * Export a singleton Supabase client that can be imported anywhere in the app.
 *
 * Key options:
 *   - 'realtime.WebSocket': overrides the default WebSocket constructor so that
 *     subscriptions work reliably in a React Native environment.
 */
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON!,
  { realtime: { WebSocket: ws } }
);
