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

// MVP “Presenter” hook that fetches the latest temperature / humidity / weight
// and subscribes to realtime changes.
import { useSensorPresenter } from './src/presenters/useSensorPresenter';

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
  // Pull live sensor readings via the Presenter hook.
  const { temp, hum, wt } = useSensorPresenter();

  // Pass the readings down as props to the dashboard view.
  return <DashboardScreen temp={temp} hum={hum} wt={wt} />;
}
