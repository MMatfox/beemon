// Polyfills the WHATWG URL API (required by Supabase's internals in React Native
// because the native runtime doesn't implement the full browser API surface).
import 'react-native-url-polyfill/auto';

// Factory for creating a Supabase client instance.
import { createClient } from '@supabase/supabase-js';

// Cross-platform WebSocket implementation.  
// React Native's global 'WebSocket' sometimes lacks features that Supabase's
// realtime service expects, so we inject 'isomorphic-ws' instead.
import ws from 'isomorphic-ws';

// REST endpoint of your Supabase project.
// (Project Settings -> API)
const SUPABASE_URL = 'https://bvltoiohmaouguwvpxhs.supabase.co';

// Public "anon" API key that grants the same privileges as the "public" role defined 
// in your database's RLS policies.
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bHRvaW9obWFvdWd1d3ZweGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzM5NTQsImV4cCI6MjA2MzkwOTk1NH0.rWvL1BXDkeUDH2Q2_jv2h0MV1JWa40d_YcCbNYtWhFg';

/**
 * Export a singleton Supabase client that can be imported anywhere in the app.
 *
 * Key options:
 *   - 'realtime.WebSocket': overrides the default WebSocket constructor so that
 *     subscriptions work reliably in a React Native environment.
 */
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    realtime: {WebSocket: ws},
  },
);
