/**
 * metro.config.js
 * ----------------------------------------------------------------------------
 * Custom Metro (React Native / Expo) configuration.
 *
 * Goals:
 *   1. Ensure the resolver understands the `"react-native"` condition in
 *      package.json → "exports" fields (required by some modern libraries).
 *   2. Provide browser-friendly shims for Node-core modules so libraries that
 *      expect them (e.g. Supabase’s WebSocket stack) can still bundle.
 *   3. Explicitly map `ws` to the browser build that ships with isomorphic-ws.
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/* -------------------------------------------------------------------------- */
/*               Start from Expo’s default Metro configuration                */
/* -------------------------------------------------------------------------- */
const config = getDefaultConfig(__dirname);

/* -------------------------------------------------------------------------- */
/*      Add "react-native" to the list of export-condition names              */
/* -------------------------------------------------------------------------- *
 * Some NPM packages expose multiple builds via `package.json#exports`:
 *   {
 *     "exports": {
 *       "import": { "react-native": "./dist/native.mjs", "default": "./dist/web.mjs" }
 *     }
 *   }
 * Metro looks at `conditionNames` to pick the right entry.  Older versions
 * don’t include "react-native" by default, so we prepend it.
 */
config.resolver = config.resolver || {};
config.resolver.conditionNames = [
  'react-native',
  ...(config.resolver.conditionNames || []),
];

/* -------------------------------------------------------------------------- */
/*      Stub out Node-core modules & map `ws` to the browser build            */
/* -------------------------------------------------------------------------- */
const empty = path.resolve(__dirname, 'empty.js'); // tiny noop module

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  // Force the bundler to use the browser-compatible WebSocket polyfill
  ws: path.resolve(__dirname, 'node_modules/isomorphic-ws/browser.js'),

  // Bare-bones shims for Node built-ins that have no equivalent in RN.
  net:     empty,
  tls:     empty,
  dns:     empty,
  http:    empty,
  https:   empty,
  stream:  empty,
  crypto:  empty,
  zlib:    empty,
  assert:  empty,
  util:    empty,
};

module.exports = config;
