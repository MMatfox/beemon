// ─────────────────────────────────────────────────────────────────────────────
// OtherInfoSection.js
// Collapsible list of miscellaneous hive information.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronUp, ChevronDown, CloudSun, Bug, Crown, Info } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import Card from '../common/Card';

export default function OtherInfoSection({ theme }) {
  const { t } = useTranslation();

  const [expand, setExpand] = useState(true);

  /* Stub values that would normally come from an API */
  const weather = { condition: 'Sunny', temp: 28, wind: '5 km/h N' };
  const queen   = { present: true };
  const pest    = { detected: false, type: 'None' };

  const rows = [
    { title: `${t('localWeather')}`, Icon: CloudSun, details: `${weather.condition}, ${weather.temp}°C` },
    { title: `${t('queenStatus')}`, Icon: Crown, details: `${t('present')}: ${queen.present ? t('presentYes') : t('presentNo')}` },
    { title: `${t('pests')}`, Icon: Bug, details: pest.detected ? pest.type : `${t('noneDetected')}`},
  ];

  return (
    <Card title={t('additionalInfo')} iconName={Info} theme={theme}>
      {/* Expand / collapse toggle */}
      <TouchableOpacity style={styles.btn} onPress={() => setExpand(!expand)}>
        <Text style={{ color: theme.primary }}>{expand ? `${t('hide')}` : `${t('display')}`} {t('details')}</Text>
        {expand ? <ChevronUp color={theme.primary} /> : <ChevronDown color={theme.primary} />}
      </TouchableOpacity>

      {/* Row list ----------------------------------------------------------- */}
      {expand &&
        rows.map(r => (
          <View key={r.title} style={[styles.row, { backgroundColor: theme.background }]}>
            <r.Icon size={18} color={theme.text} style={{ marginRight: 8 }} />
            <View>
              <Text style={[styles.tit, { color: theme.text }]}>{r.title}</Text>
              <Text style={[styles.det, { color: theme.subtleText }]}>{r.details}</Text>
            </View>
          </View>
        ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  btn: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 8 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    borderRadius: 6, 
    marginBottom: 6 
  },
  tit: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  det: {
    fontSize: 12 
  },
});
