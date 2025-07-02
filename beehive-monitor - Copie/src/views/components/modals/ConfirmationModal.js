// ─────────────────────────────────────────────────────────────────────────────
// ConfirmationModal.js
// Generic yes/no dialog used for deletions and other destructive actions.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomModal from '../common/CustomModal';
import CustomButton from '../common/CustomButton';

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  theme,
}) {
  const { t } = useTranslation();
  return (
    <CustomModal visible={visible} onClose={onClose} title={title} theme={theme}>
      <Text style={{ textAlign: 'center', marginBottom: 20, color: theme.text }}>
        {message}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <CustomButton
          title={t('cancel')}
          variant="secondary"
          onPress={onClose}
          theme={theme}
          style={{ flex: 1, marginRight: 10 }}
        />
        <CustomButton
          title={t('confirm')}
          variant="danger"
          onPress={onConfirm}
          theme={theme}
          style={{ flex: 1 }}
        />
      </View>
    </CustomModal>
  );
}
