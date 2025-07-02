// ─────────────────────────────────────────────────────────────────────────────
// HiveSettingsListModal.js
// Lists all hives with edit / delete controls and a Call To Action to add new ones.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Edit3, Trash2, PlusCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import CustomModal from '../common/CustomModal';
import CustomButton from '../common/CustomButton';
import ConfirmationModal from './ConfirmationModal';

export default function HiveSettingsListModal({
  visible,
  onClose,
  hives,                 // array of hive objects
  onOpenAddHive,         // open AddEditHiveModal in "add" mode
  onOpenEditHive,        // (id) -> open modal in "edit" mode
  onDeleteHive,   // (id) -> open ConfirmationModal
  theme,
}) {
  const { t } = useTranslation();

  /* état interne du “confirm” */
  const [confirm, setConfirm] = React.useState(false);
  const [delId, setDelId] = React.useState(null);

  const handleDelete = () => {
    if (delId) onOpenDeleteConfirm(delId); // callback parent
    setConfirm(false);
  };
  return (
    <CustomModal visible={visible} onClose={onClose} title={t('managingHivesTitle')} theme={theme}>
      {/* Empty-state text */}
      {hives.length === 0 ? (
        <Text style={{ color: theme.subtleText, textAlign: 'center', marginVertical: 20 }}>
          {t('noHiveConfigured')}
        </Text>
      ) : (
        <View style={{ maxHeight: 300 /* prevent giant lists from growing too tall */ }}>
          <ScrollView>
            {hives.map(h => (
              <View key={h.id} style={[styles.row, { borderBottomColor: theme.borderColor }]}>
                {/* Hive name + optional code */}
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={[styles.nm, { color: theme.text }]}>{h.name}</Text>
                  {h.code && (
                    <Text style={{ fontSize: 12, color: theme.subtleText }}>{t('code')}: {h.code}</Text>
                  )}
                </View>

                {/* Edit / delete icon buttons */}
                <CustomButton
                  variant="ghost"
                  iconName={Edit3}
                  onPress={() => onOpenEditHive(h.id)}
                  theme={theme}
                  style={{ padding: 5 }}
                />
                <CustomButton
                  variant="ghost"
                  iconName={Trash2}
                  onPress={() => { setDelId(h.id); setConfirm(true); }}
                  theme={theme}
                  style={{ padding: 5 }}
                  textStyle={{ color: theme.danger }}
                />
                < ConfirmationModal
                  visible={confirm}
                  onClose={() => setConfirm(false)}
                  onConfirm={() => {
                    if (delId) onDeleteHive(delId);   // 🔥 supprime vraiment
                      setConfirm(false);
                  }}
                title={t('confirmDeletionTitle')}
                message={t('confirmDeletionMessage', {
                  name: hives.find(h => h.id === delId)?.name,
                })}
                theme={theme}
                />
              </View>
            ))}
          </ScrollView>
        </View >
      )
      }

      {/* Add-new-hive Call To Action */}
      <CustomButton
        title={t('addNewHive')}
        iconName={PlusCircle}
        onPress={onOpenAddHive}
        theme={theme}
        style={{ marginTop: 20 }}
      />
    </CustomModal >
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  nm: {
    fontSize: 15,
    fontWeight: '500'
  },
});