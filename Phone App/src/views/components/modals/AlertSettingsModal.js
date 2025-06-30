// ─────────────────────────────────────────────────────────────────────────────
// AlertSettingsModal.js
// Allows the user to adjust min/max thresholds for temperature, humidity, weight.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomModal from '../common/CustomModal';
import CustomButton from '../common/CustomButton';

export default function AlertSettingsModal({
  visible,
  onClose,
  settings,  // current { temperature: {min,max}, humidity:{…}, weight:{…} }
  onSave,    // callback(newSettings)
  theme,
}) {
  const { t } = useTranslation();

  const [cur, setCur] = useState(settings);

  /* Reset local copy when modal (re)opens */
  useEffect(() => setCur(settings), [settings, visible]);

  /* Update nested value (min/max) for a given key */
  const onChange = (k, field, val) => {
    const num = parseFloat(val);
    setCur(p => ({
      ...p,
      [k]: { ...p[k], [field]: isNaN(num) ? '' : num },
    }));
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={t('configureAlertThresholds')}
      theme={theme}
    >
      {['temperature', 'humidity', 'weight'].map(k => (
        <View key={k} style={{ marginBottom: 12 }}>
          <Text style={{ color: theme.text, fontWeight: '500', marginBottom: 6 }}>
            {k === 'temperature'
              ? `${t('temperatureLabel')}`
              : k === 'humidity'
              ? `${t('humidityLabel')}`
              : `${t('weightLabel')}`}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {['min', 'max'].map(f => (
              <TextInput
                key={f}
                placeholder={f === 'min' ? `${t('min')}` : `${t('max')}`}
                keyboardType="numeric"
                placeholderTextColor={theme.subtleText}
                value={String(cur[k][f])}
                onChangeText={t => onChange(k, f, t)}
                style={[
                  styles.in,
                  { backgroundColor: theme.background, color: theme.text, borderColor: theme.borderColor },
                ]}
              />
            ))}
          </View>
        </View>
      ))}

      <CustomButton title={t('save')} onPress={() => onSave(cur)} theme={theme} />
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  in: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 12,
    fontSize: 14,
    width: '48%',
  },
});