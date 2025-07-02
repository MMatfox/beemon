# Beehive Monitor 🐝📊

**React Native / Expo** application for real-time monitoring of a beehive’s **temperature**, **humidity**, and **weight**, using connected sensors and **Supabase**.

*Original repository is coming from https://iut-git.unice.fr/vietnam2025/beehive-monitor*

---

## ✨ Main Features

| Module                | Description                                                                                  |
|----------------------|----------------------------------------------------------------------------------------------|
| **Dashboard**         | Main view with live overview and 24h / 7d / 30d historical charts for the three sensors.     |
| **Alerts**            | Configurable min/max thresholds + recent alerts list.                                        |
| **Multimedia**        | Live or replay audio/video access (to be integrated).                                        |
| **Hive Management**   | Add, edit, and delete multiple hives.                                                        |
| **Light/Dark Theme**  | Toggle with a simple tap.                                                                    |

---

## 📁 Project Structure (Simplified)

```
.
├─ App.tsx               # Expo entry point
├─ metro.config.js       # Node & WebSocket polyfills
├─ src/
│  ├─ presenters/        # “Presenter” hooks (MVP)
│  ├─ views/             # Main pages (DashboardScreen)
│  │  └─ components/
│  │    ├─ common/       # Reusable UI: Card, Button, Modal...
│  │    └─ sections/     # OverviewSection, ChartsSection...
│  ├─ models/            # Supabase data access (sensorModel)
│  └─ utils/             # Helpers (chartHelpers, etc.)
└─ empty.js              # empty Node shim for Metro
```

---

## 🚀 Getting Started

### 0. Full Environment Setup (From Scratch)

#### ✅ Step 1 – Install Node.js

##### For macOS / Linux (via NVM):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # or ~/.zshrc
nvm install --lts
node -v
npm -v
```

##### For Windows:
Download and install Node.js LTS from:  
👉 https://nodejs.org

Then confirm installation:

```bash
node -v
npm -v
```

---

#### ✅ Step 2 – Install Expo CLI

```bash
npm install -g expo-cli
expo --version
```

---

#### ✅ Step 3 – (Optional) Install React Native CLI

```bash
npm install -g react-native-cli
```

> Only needed if you want to create or run pure React Native projects (not required for this app which uses Expo).

---

### 1. Project Dependencies

- **Node.js >= 18**
- **Expo CLI**
- A **Supabase** project with a `sensor_data` table containing:
  - `temperature`, `humidity`, `weight`, `created_at`
- Environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_KEY` (public *anon* key)

---

### 2. Clone and Install the App

```bash
git clone https://github.com/MMatfox/beemon.git
cd '.\beemon\Phone App\'

npm install
```

---

### 3. Run the App (Development Mode)

```bash
expo start
```

This opens **Expo DevTools** in your browser.

#### 📱 Run on your physical phone (Recommended)

1. Install **Expo Go**:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Connect your phone to the **same Wi-Fi network** as your computer.

3. Open **Expo Go**, scan the QR code shown in the browser.

The app will launch directly on your device.

---

#### 🖥️ Run on an emulator

##### Android:
1. Install Android Studio and set up a virtual device.
2. In Expo DevTools, click **"Run on Android device/emulator"**.

##### iOS (Mac only):
1. Install Xcode and open Simulator.
2. In Expo DevTools, click **"Run on iOS simulator"**.

---

### 4. (Optional) Build Native App (APK / IPA)

#### Using EAS Build:

```bash
npx expo install eas-cli
npx eas build --platform android   # or ios
```

> You'll need to log in with an Expo account and follow setup instructions.

---

## ⚙️ Supabase Setup

1. Go to https://supabase.com and create a project.
2. Create a `sensor_data` table with columns:
   - `temperature` (float)
   - `humidity` (float)
   - `weight` (float)
   - `created_at` (timestamp)

### For a faster way with everything already done, use the `DataBase.sql` file.

3. Enable **Realtime** for this table (in table settings).
4. In the code, set your Supabase URL and anon key in:

```ts
// src/models/supabaseClient.ts

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { WebSocket: ws },
});
```

---

## 🛠️ Technical Notes

- **Metro Polyfills**: `metro.config.js` handles unsupported Node modules like `net`, `tls` by redirecting `ws` to `isomorphic-ws`.
- **MVP Architecture**: Project follows the Model-View-Presenter pattern.
- Uses **TypeScript**, with ESLint + Prettier recommended for consistency.

---

### 🌐 Internationalization

Uses **i18next** and `expo-localization`.

- Language files are in `src/i18n/*.json`
- Auto-detects system locale
- Manual language change example:

```ts
i18n.changeLanguage('fr');
```
