
/**
 * DashboardScreen – main view for the beehive-monitoring app.
 *
 * Displays:
 *   - Header with hive selector
 *   - Overview tiles for the latest sensor readings
 *   - Charts on a selectable time range
 *   - Media carousel, alerts, and miscellaneous info
 *
 * Provides:
 *   - Light / dark theme toggle
 *   - CRUD operations for multiple hives (add, edit, delete)
 */
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from 'react-native';

import { Sun, Moon, ListChecks, PlusCircle } from 'lucide-react-native';

import { lightTheme, darkTheme } from './themes';
import { useTheme } from '../theme/useTheme';
import styles from './styles';

import { useTranslation } from 'react-i18next';

/* --------------------- UI Sections & Modals ---------------------- */

import Header from './components/common/Header';
import OverviewSection from './components/sections/OverviewSection';
import ChartsSection from './components/sections/ChartsSection';
import MediaSection from './components/sections/MediaSection';
import AlertsSection from './components/sections/AlertsSection';
import OtherInfoSection from './components/sections/OtherInfoSection';
import BeehiveManagementSection from './components/sections/BeehiveManagementSection';
import SettingsSection from './components/sections/SettingsSection';

import AlertSettingsModal from './components/modals/AlertSettingsModal';
import HiveSettingsListModal from './components/modals/HiveSettingsListModal';
import AddEditHiveModal from './components/modals/AddEditHiveModal';
import ConfirmationModal from './components/modals/ConfirmationModal';
import CustomButton from './components/common/CustomButton';
import { useHiveSession } from '../presenters/useHiveSession';

/* ------------------------------------------------------------------ */
/*                             Component                              */
/* ------------------------------------------------------------------ */

export default function DashboardScreen({temp: initT = 0,
  hum:  initH = 0,
  wt:   initW = 0,}) {

  /* ------------------------- Theme toggle ------------------------ */
  const { dark, toggle } = useTheme();
  const theme = dark ? darkTheme : lightTheme;

  /* ---------------------- Hive management ------------------------ */
  const { hives, hiveId, addOrUpdateHive, removeHive, login, selectHive } = useHiveSession();
  const [sel, setSel] = useState<string | null>(null);

  useEffect(() => {
  if (sel) {
    selectHive(sel);
  }
}, [sel]);

  /* ---------------- Time-range for historical charts ------------- */
  const [time, setTime] = useState<'24h' | '7d' | '30d'>('24h');

  /* ----------------------- Alert handling ------------------------ */
  interface Alert {
      id: number;
      message: string;
      time: string;
      type: 'info' | 'error';
  }

  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertSet, setAlertSet] = useState({
    temperature: { min: 28, max: 36 }, humidity: { min: 50, max: 70 }, weight: { min: 8, max: 25 },
  });

  /* ------------------------ Modal flags -------------------------- */
  const [modalAlert, setModalAlert] = useState(false);
  const [modalList, setModalList] = useState(false);
  const [modalHive, setModalHive] = useState(false);
  const [editHive, setEditHive] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [delId, setDelId] = useState(null);


  /* ---------------------------------------------------------------- */
  /*   (1) Restaurer la ruche au lancement  |  (2) Persister ensuite   */
  /* ---------------------------------------------------------------- */

  // 1) Démarrage : chercher 'currentHive' et sélectionner la ruche
   useEffect(() => {
    if (hiveId)               setSel(hiveId);
    else if (hives.length)    setSel(hives[0].id);
    else                      setSel(null);
   }, [hives, hiveId]);


  /* ------------------------------------------------------------------ */
  /*                       CRUD helpers for hives                       */
  /* ------------------------------------------------------------------ */

  /* -------- saveHive -------- */
const saveHive = async (d) => {
  if (editHive) {
    addOrUpdateHive({ ...editHive, ...d });     // mise à jour
  } else {
    /* on passe par login() qui appelle RPC + ajoute la ruche */
    const newId = await login(d.code, d.password);
    addOrUpdateHive({ id: newId, name: d.name, code: d.code });
    setSel(newId);
  }
};

/* -------- delHive -------- */
const delHive = (id: string) => {
  removeHive(id);               // supprime et met à jour sel si besoin
  setConfirm(false);
};
  const handleDoorOpen = () => {
    // Logique pour ouvrir la porte
    console.log('Opening beehive door...');
    // Ici appeler API ou service
  };

  const handleDoorClose = () => {
    // Logique pour fermer la porte
    console.log('Closing beehive door...');
  };

  const handleRepulse = () => {
    // Logique pour activer le répulsif
    console.log('Activating repulsive system...');
  };

  const handleSystemRestart = () => {
    // Logique pour redémarrer le système
    console.log('Restarting beehive system...');
  };

  /* ------------------------------------------------------------------ */
  /*                               Render                               */
  /* ------------------------------------------------------------------ */

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
    >
      {/* Status-bar tint adapts to the active theme. */}
      <StatusBar
        barStyle={theme.statusBar}
        backgroundColor={theme.background}
      />

      {/* ----------- Header with hive picker ----------- */}
      <Header
        selectedHive={sel}
        onHiveChange={setSel}
        hives={hives}
        theme={theme}
      />

      {/* ------------- Primary scrollable content ------------- */}
      <ScrollView contentContainerStyle={styles.sv}>
        {hives.length > 0 && sel ?
          <>
            <OverviewSection hiveId={sel} theme={theme} />
            <ChartsSection
              hiveId={sel}
              timeRange={time}
              onTimeRangeChange={setTime}
              theme={theme}
            />
            <MediaSection hiveId={sel} theme={theme} />
            <AlertsSection
              alerts={alerts}
              onOpenAlertSettings={() => setModalAlert(true)}
              theme={theme}
            />
            <OtherInfoSection theme={theme} />
            <BeehiveManagementSection
              offline={false}
              onDoorOpen={handleDoorOpen}
              onDoorClose={handleDoorClose}
              onRepulse={handleRepulse}
              onSystemRestart={handleSystemRestart}
              theme={theme}
            />
            <SettingsSection theme={theme} />
          </>
          :
          /* Empty-state: invite the user to add a first hive. */
          <ScrollView contentContainerStyle={styles.no}>
            <CustomButton
              title={t('addHiveButton')}
              onPress={() => {
                setEditHive(null);
                setModalHive(true);
              }}
              iconName={PlusCircle}
              theme={theme} />
          </ScrollView>
        }
      </ScrollView>

      {/* --------------------- Floating action buttons --------------------- */}
      {/* Theme toggle (light <-> dark). */}
      <TouchableOpacity
        style={[styles.fab, styles.fabTheme, { backgroundColor: theme.cardBackground }]}
        onPress={toggle}
      >
        {dark ?
          <Sun color={theme.text} size={24} />
          :
          <Moon color={theme.text} size={24} />
        }
      </TouchableOpacity>

      {/* Hive settings list (opens modal). */}
      <TouchableOpacity
        style={[styles.fab, styles.fabSet, { backgroundColor: theme.primary }]}
        onPress={() => setModalList(true)}>
        <ListChecks color={theme.primaryText} size={24} />
      </TouchableOpacity>

      {/* ----------------------------- Modals ----------------------------- */}
      <AlertSettingsModal
        visible={modalAlert}
        onClose={() => setModalAlert(false)}
        settings={alertSet}
        onSave={s => {
          setAlertSet(s);
          setModalAlert(false);
        }}
        theme={theme}
      />

      <HiveSettingsListModal
        visible={modalList}
        onClose={() => setModalList(false)}
        hives={hives}
        onOpenAddHive={() => {
          setEditHive(null);
          setModalList(false);
          setModalHive(true);
        }}
        onOpenEditHive={id => {
          setEditHive(hives.find(h => h.id === id));
          setModalList(false);
          setModalHive(true);
        }}
        onDeleteHive={id => 
          delHive(id)
        }
        theme={theme}
      />

      <AddEditHiveModal
        visible={modalHive}
        onClose={() => setModalHive(false)}
        hiveToEdit={editHive}
        onSaveHive={saveHive}
        theme={theme}
      />

      <ConfirmationModal
        visible={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={delHive}
        title="Confirm deletion"
        message={`Delete the hive "${hives.find(h => h.id === delId)?.name}" ?`}
        theme={theme}
      />
    </SafeAreaView>
  );
}
