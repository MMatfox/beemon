// ─────────────────────────────────────────────────────────────────────────────
// BeehiveManagementSection.js
// Card that provides controls for managing the beehive hardware (door, repulsive, system).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Settings, DoorOpen, DoorClosed, Zap, RotateCcw, WifiOff } from 'lucide-react-native';

import Card from '../common/Card';
import CustomButton from '../common/CustomButton';
import ConfirmationModal from '../modals/ConfirmationModal';
import { useTranslation } from 'react-i18next';

export default function BeehiveManagementSection({ 
  offline = false,
  onDoorOpen,
  onDoorClose,
  onRepulse,
  onSystemRestart,
  theme 
}) {
  const { t } = useTranslation();

  // État pour les modales de confirmation
  const [confirmAction, setConfirmAction] = useState(null);

  // Actions qui nécessitent une confirmation
  const actions = {
    doorOpen: {
      title: t('confirmDoorOpen'),
      message: t('confirmDoorOpenMessage'),
      onConfirm: onDoorOpen,
      variant: 'primary'
    },
    doorClose: {
      title: t('confirmDoorClose'),
      message: t('confirmDoorCloseMessage'),
      onConfirm: onDoorClose,
      variant: 'danger'
    },
    repulse: {
      title: t('confirmRepulse'),
      message: t('confirmRepulseMessage'),
      onConfirm: onRepulse,
      variant: 'danger'
    },
    restart: {
      title: t('confirmRestart'),
      message: t('confirmRestartMessage'),
      onConfirm: onSystemRestart,
      variant: 'secondary'
    }
  };

  const handleAction = (actionKey) => {
    setConfirmAction(actionKey);
  };

  const handleConfirm = () => {
    if (confirmAction && actions[confirmAction]) {
      actions[confirmAction].onConfirm?.();
    }
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setConfirmAction(null);
  };

  return (
    <>
      <Card title={t('beehiveManagement')} iconName={Settings} theme={theme}>
        {offline ? (
          <View style={styles.offlineContainer}>
            <WifiOff size={24} color={theme.subtleText} style={{ marginBottom: 8 }} />
            <Text style={[styles.offlineText, { color: theme.subtleText }]}>
              {t('beehiveManagementOffline')}
            </Text>
          </View>
        ) : (
          <>
            {/* Door Controls */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {t('doorControl')}
              </Text>
              <View style={styles.buttonRow}>
                <CustomButton
                  title={t('openDoor')}
                  variant="primary"
                  iconName={DoorOpen}
                  onPress={() => handleAction('doorOpen')}
                  theme={theme}
                  style={styles.button}
                />
                <CustomButton
                  title={t('closeDoor')}
                  variant="danger"
                  iconName={DoorClosed}
                  onPress={() => handleAction('doorClose')}
                  theme={theme}
                  style={styles.button}
                />
              </View>
            </View>

            {/* Repulsive Control */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {t('repulsiveControl')}
              </Text>
              <CustomButton
                title={t('activateRepulsive')}
                variant="danger"
                iconName={Zap}
                onPress={() => handleAction('repulse')}
                theme={theme}
                style={styles.fullWidthButton}
              />
            </View>

            {/* System Control */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {t('systemControl')}
              </Text>
              <CustomButton
                title={t('restartSystem')}
                variant="secondary"
                iconName={RotateCcw}
                onPress={() => handleAction('restart')}
                theme={theme}
                style={styles.fullWidthButton}
              />
            </View>
          </>
        )}
      </Card>

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmationModal
          visible={true}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title={actions[confirmAction].title}
          message={actions[confirmAction].message}
          theme={theme}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  offlineContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  offlineText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  fullWidthButton: {
    width: '100%',
  },
});