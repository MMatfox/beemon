// -----------------------------------------------------------------------------
// Header.js
// Top bar showing the application title and a Picker for selecting the hive.
// -----------------------------------------------------------------------------
import React from 'react';
import { View, Text, Platform, Dimensions, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function Header({ selectedHive, onHiveChange, hives, theme }) {
  const { t } = useTranslation();

  const displayHives = hives ?? [];

  const [open, setOpen] = useState(false);
  const value = selectedHive;

  console.table(
    displayHives.map(h => ({ id: h.id, name: h.name }))
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          borderBottomColor: theme.borderColor
        }
      ]}
    >
      {/* App title (brand colour) */}
      <Text style={[styles.title, { color: theme.primary }]}>Beehive Monitor</Text>

      {/* --- Hive Selector --- */}
      <DropDownPicker

        ArrowDownIconComponent={({ style }) => (
          <ChevronDown size={24} color={theme.tooltipText} style={style} />
        )}

        ArrowUpIconComponent={({ style }) => (
          <ChevronUp size={24} color={theme.tooltipText} style={style} />
        )}

        open={open}
        setOpen={setOpen}
        value={value}
        setValue={cb => onHiveChange(cb(value))}
        items={displayHives.map(h => ({ label: h.name, value: h.id }))}
        itemKey="value"
        placeholder={t('placeholderSelectHive')}
        disabled={hives?.length === 0}
        style={{
          borderColor: theme.tooltipText,
          backgroundColor: theme.primary,
          width: width * 0.35,
          minHeight: 22,
          marginLeft: width * 0.195,
        }}
        textStyle={{ color: theme.text, fontSize: 12, fontWeight: '600' }}
        placeholderStyle={{ color: theme.subtleText }}
        dropDownDirection="AUTO"
        listMode="FLATLIST"
        dropDownContainerStyle={{
          width: width * 0.35,
          borderColor: theme.borderColor,
          backgroundColor: theme.cardBackground,
          zIndex: 1000,
          marginLeft: width * 0.195,
        }}
        labelStyle={{ color: theme.tooltipText, fontSize: 12, fontWeight: '700' }}
        tickIconStyle={{ tintColor: theme.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
});
