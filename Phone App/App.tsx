// ─────────────────────────────────────────────────────────────────────────────
// App.tsx (entry point)
// Sets up the WebSocket polyfill, pulls live sensor data through a Presenter
// hook, and renders the dashboard view.
// ─────────────────────────────────────────────────────────────────────────────

// Polyfill the WHATWG URL API required by Supabase in React Native.
import 'react-native-url-polyfill/auto';

// Cross-platform WebSocket implementation (isomorphic-ws works in RN, Node, web).
import ws from 'isomorphic-ws';

// Main UI screen
import DashboardScreen from './src/views/DashboardScreen';

import { ensureDeviceUser } from './src/bootstrapDeviceUser';
import React, { useEffect, useState } from 'react';
import SplashScreen from './src/views/SplashScreen';

// --------------------------------------------------------------------------------
// On iOS & Android, the global WebSocket constructor is sometimes incomplete or
// missing features needed by Supabase’s realtime service.  We therefore replace
// the global reference before any Supabase code runs.
// --------------------------------------------------------------------------------
(global as any).WebSocket = ws;

// --------------------------------------------------------------------------------
// Functional component exported as the root of the React Native app.
// --------------------------------------------------------------------------------
export default function App() {
const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await ensureDeviceUser();
        setReady(true);
      } catch (e) {
        console.error('Auth bootstrap failed', e);
      }
    })();
  }, []);

  if (!ready) return <SplashScreen />;
  // Pass the readings down as props to the dashboard view.
  return <DashboardScreen/>;
}
