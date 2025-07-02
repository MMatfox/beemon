# Beehive Monitor 🐝📊

Application **React Native / Expo** permettant de surveiller en temps réel la température, l’humidité et le poids d’une ruche grâce à des capteurs connectés et à Supabase.

---

## ✨ Fonctionnalités principales

| Module                   | Description                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Dashboard**            | Vue principale affichant un aperçu instantané des trois capteurs et des graphiques historiques 24 h / 7 j / 30 j. |
| **Alertes**              | Seuils min / max configurables + liste des alertes récentes.                                                      |
| **Multimédia**           | Accès audio / vidéo en direct ou en différé (à intégrer).                                                         |
| **Gestion de ruches**    | Ajout, édition, suppression de plusieurs ruches.                                                                  |
| **Thème clair / sombre** | Bascule par simple appui.                                                                                         |

---

## 📁 Arborescence (simplifiée)

```
.
├─ App.tsx               # point d’entrée Expo
├─ metro.config.js       # polyfills Node & WebSocket
├─ src/
│  ├─ presenters/        # Hooks « Presenters » (MVP)
│  ├─ views/             # Pages principales (DashboardScreen)
│  │  └─components/
│  │    ├─ common/       # Card, Button, Modal… réutilisables
│  │    └─ sections/     # OverviewSection, ChartsSection, …
│  ├─ models/            # Accès Supabase (sensorModel)
│  └─ utils/             # Helpers (chartHelpers, etc.)
└─ empty.js              # shim Node vide pour Metro
```

---

## 🚀 Mise en route

### 1. Prérequis

* **Node >= 18**
* **Expo CLI** : `npm i -g expo-cli`
* Compte **Supabase** avec table `sensor_data` (colonnes : `temperature`, `humidity`, `weight`, `created_at`).
* Variables : `SUPABASE_URL` et `SUPABASE_KEY` (clé *anon*).

### 2. Installation

```bash
# Clone du dépôt
git clone https://iut-git.unice.fr/vietnam2025/beehive-monitor.git
cd beehive-monitor

# Dépendances JS
npm install
```

### 3. Lancement en développement

```bash
expo start
```

> L’application démarre sur votre appareil / émulateur via le QR‑code Expo.

### 4. Build natif (optionnel)

```bash
expo build:android   # ou expo build:ios
```

---

## ⚙️ Configuration Supabase

1. Créer un projet Supabase
2. Activer `Realtime` sur la table **sensor\_data**
3. Copier l’URL et la clé *anon* dans `src/models/supabaseClient.ts`

```ts
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { WebSocket: ws },
});
```

---

## 🛠️ Notes techniques

* **Polyfills Metro** : `metro.config.js` redirige `ws` vers *isomorphic‑ws* et neutralise les modules Node (`net`, `tls`…).
* **MVP Pattern** : Utiliser le modèle Modèle-Vue-Presenteur
* **TypeScript** activé, ESLint + Prettier conseillés.

---

### 🌐 Internationalisation

L’app utilise **i18next** (+ `expo-localization`) :  
- Fichiers de langue dans `src/i18n/*.json`  
- Détection auto de la locale (`expo-localization`)  
- Changement à chaud avec `i18n.changeLanguage('fr')`.
