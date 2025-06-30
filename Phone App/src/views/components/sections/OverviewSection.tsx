// ─────────────────────────────────────────────────────────────────────────────
// OverviewSection.js
// Displays the latest snapshot as tiles.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Thermometer, Droplet, Weight, Gauge } from 'lucide-react-native';

import { HivePresenter, HiveView } from '../../../presenters/HivePresenter';
import Card from '../common/Card';

import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const EMPTY = { temperature: 0, humidity: 0, weight: 0 };

export default function OverviewSection({ hiveId, theme }: { hiveId: string; theme: any }) {
  const { t }   = useTranslation();                    // ← ici, pas plus bas
  const presenter = useRef<HivePresenter | null>(null);
  const [data, setData] = useState(EMPTY);

  /* implémente l’interface HiveView */
  const view: HiveView = {
    displaySnapshot: snap => setData(snap),
    showError: _msg => {},
  };

useEffect(() => {
  if (!hiveId) { setData(EMPTY); return; }

    presenter.current = new HivePresenter(view);
    presenter.current.loadInitial(hiveId);

    return () => presenter.current?.dispose();
  }, [hiveId]);


  /* Convert readings into display-ready items */
  const items = [
    { label: `${t('temperature')}`, value: `${data.temperature}°C`,     Icon: Thermometer, color: '#f87171' },
    { label: `${t('humidity')}`,    value: `${data.humidity}%`,  Icon: Droplet,     color: '#60a5fa' },
    { label: `${t('weight')}`,      value: `${data.weight} kg`,  Icon: Weight,      color: '#84cc16' },
  ];

  return (
    <Card title={t('hiveData')} iconName={Gauge} theme={theme}>
      <View style={styles.grid}>
        {items.map(it => (
          <View key={it.label} style={[styles.it, { backgroundColor: theme.background }]}>
            <it.Icon size={28} color={it.color} />
            <Text style={[styles.lbl, { color: theme.subtleText }]}>{it.label}</Text>
            <Text style={[styles.val, { color: theme.text }]}>{it.value}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    flexWrap: 'wrap' 
  },
  it:   { 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderRadius: 8, 
    minWidth: (width - 60) / 3.3, 
    marginBottom: 10 
  },
  lbl:  { 
    fontSize: 11, 
    marginTop: 4 
  },
  val:  { 
    fontSize: 15, 
    fontWeight: 'bold', 
    marginTop: 2 
  },
});