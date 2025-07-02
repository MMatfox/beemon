
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
import { SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from 'react-native';

import { Sun, Moon, ListChecks } from 'lucide-react-native';

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

/* ------------------------------------------------------------------ */
/*                             Component                              */
/* ------------------------------------------------------------------ */

export default function DashboardScreen({ temp: initT, hum: initH, wt: initW }) {

  /* ------------------------- Theme toggle ------------------------ */
  //const [dark, setDark] = useState(false);
  const { dark, toggle } = useTheme();
  const theme = dark ? darkTheme : lightTheme;

  /* ---------------------- Hive management ------------------------ */
  const [hives, setHives] = useState([
    { id: 'h1', name: 'Hive Alpha', code: 'ALPHA001', password: 'pass' },
    { id: 'h2', name: 'Hive Beta', code: 'BETA002', password: 'pass' },
  ]);
  const [sel, setSel] = useState(hives[0]?.id);

  /* ---------------- Time-range for historical charts ------------- */
  const [time, setTime] = useState('24h');

  /* -------------------- Live sensor readings --------------------- */
  const [hiveData, setHiveData] = useState({ temp: initT || 0, humidity: initH || 0, weight: initW || 0 });

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

  /* ------------------------------------------------------------------ */
  /*                    Mock data fetch / realtime hook                 */
  /* ------------------------------------------------------------------ */

  /**
   * Simulates a fetch of the latest sensor data for the given hive.
   * In production you would:
   *   - Call Supabase / Firebase / REST endpoint here
   *   - Update local state when new realtime events arrive
   */
  const fetchData = useCallback(id => {
    if (!id) { setHiveData({ temp: initT || 0, humidity: initH || 0, weight: initW || 0 }); return; }
    setHiveData({
      temp: initT ?? (20 + Math.random() * 15).toFixed(1),
      humidity: initH ?? (40 + Math.random() * 30).toFixed(1),
      weight: initW ?? (8 + Math.random() * 10).toFixed(1),
    });

    /**----------------Example----------------- */
    /*setAlerts([
      {
        id: Date.now(),
        message: `${t('hiveData')} ${hives.find(h => h.id === id)?.name}`,
        time: 'Right now', type: 'info'
      }
    ]);*/
  }, [hives, initT, initH, initW]);

  /* Effect: whenever the selected hive changes, refresh its data. */
  useEffect(() => { sel && fetchData(sel); }, [sel, fetchData]);

  /* ------------------------------------------------------------------ */
  /*                       CRUD helpers for hives                       */
  /* ------------------------------------------------------------------ */

  /** Persist a new hive or update an existing one. */
  const saveHive = d => {
    if (editHive) {
      setHives(hives.map(h => h.id === editHive.id ? { ...h, ...d } : h));
    } else {
      const n = { id: `h${Date.now()}`, ...d }; setHives([...hives, n]); setSel(n.id);
    }
  };
  const delHive = (id: string) => {
    setHives(prev => {
      const next = prev.filter(h => h.id !== id);

      // si la ruche supprimée était sélectionnée, on bascule sur la première restante
      setSel(sel => (sel === id ? next[0]?.id ?? null : sel));

      return next;
    });

    setConfirm(false); // ferme le modal
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
            <OverviewSection currentData={hiveData} theme={theme} />
            <ChartsSection
              timeRange={time}
              onTimeRangeChange={setTime}
              theme={theme}
            />
            <MediaSection theme={theme} />
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
              iconName={ListChecks}
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
