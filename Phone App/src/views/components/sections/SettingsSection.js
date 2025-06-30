import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import Card from '../common/Card';
import { supportedLangs } from '../../../i18n/supportedLangs';
import { useLocale } from '../../../i18n/useLocale';

export default function SettingsSection({ theme }) {
  const { t } = useTranslation();
  const { locale, change } = useLocale();

  const [open, setOpen] = useState(false);

  return (
    <Card title={t('settings')} iconName={Settings} theme={theme}>
      <Text style={[styles.lbl, { color: theme.text }]}>
        {t('selectLanguage')}
      </Text>

      <DropDownPicker
        scrollViewProps={{ nestedScrollEnabled: true }}   // Android
        nestedScrollEnabled={true}                        // iOS via prop interne
        listMode="SCROLLVIEW"
        open={open}
        setOpen={setOpen}
        value={locale}
        setValue={cb => change(cb(locale))}
        items={supportedLangs.map(l => ({ label: l.label, value: l.code }))}
        style={{
          borderColor: theme.borderColor,
          backgroundColor: theme.background,
          minHeight: 42,
        }}
        textStyle={{ color: theme.text }}
        dropDownContainerStyle={{
          borderColor: theme.borderColor,
          backgroundColor: theme.cardBackground,
        }}
        placeholderStyle={{ color: theme.subtleText }}
        ArrowDownIconStyle={{ tintColor: theme.subtleText }}
        ArrowUpIconStyle={{ tintColor: theme.subtleText }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  lbl: { marginBottom: 8, fontWeight: '500' },
});
