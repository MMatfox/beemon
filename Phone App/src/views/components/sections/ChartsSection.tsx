// ─────────────────────────────────────────────────────────────────────────────
// ChartsSection.tsx – courbes température & humidité réelles
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useMemo } from 'react';
import { View, Dimensions, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ChartLine } from 'lucide-react-native';

import Card from '../common/Card';
import CustomButton from '../common/CustomButton';
import { fetchSeries } from '../../../models/sensorModel';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

type Props = {
  hiveId: string;
  timeRange: '24h' | '7d' | '30d';
  onTimeRangeChange: (v: Props['timeRange']) => void;
  theme: any;
};

export default function ChartsSection({ hiveId, timeRange, onTimeRangeChange, theme }: Props) {
  const { t } = useTranslation();

  const ranges = [
    { label: `24${t('hour')}`, value: '24h' },
    { label: `7${t('day')}`, value: '7d' },
    { label: `30${t('day')}`, value: '30d' },
  ];

  const [serie, setSerie] = useState<{ labels: string[]; temps: number[]; hums: number[] }>({ labels: [], temps: [], hums: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchSeries(hiveId, timeRange)
      .then(d => mounted && setSerie(d))
      .catch(e => console.error('chart', e))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [hiveId, timeRange]);

  const yAxisMin = useMemo(() => {
    if (serie.temps.length === 0 && serie.hums.length === 0) {
      return 0; // Guard clause for empty state
    }
    const allValues = [...serie.temps, ...serie.hums];
    const minValue = Math.min(...allValues);
    return Math.floor(minValue - 5);
  }, [serie.temps, serie.hums]);


  const [point, setPoint] = useState<any>(null);
  const tooltip = () => {
    if (!point) return null;
    const w = 120, h = 60, area = width - 60;
    let tx = point.x - w / 2, ty = point.y - h - 10;
    if (tx < 0) tx = 5;
    if (tx + w > area) tx = area - w - 5;
    if (ty < 0) ty = point.y + 15;

    // ✨ Le tooltip est maintenant une simple vue non-interactive.
    return (
      <View
        style={[styles.tt, { left: tx, top: ty, backgroundColor: theme.tooltipBackground }]}
      >
        <Text style={[styles.ttTx, { color: theme.tooltipText, fontWeight: 'bold' }]}>{point.label}</Text>
        <Text style={[styles.ttTx, { color: theme.tooltipText }]}>Temp: {point.temp}°C</Text>
        <Text style={[styles.ttTx, { color: theme.tooltipText }]}>Hum: {point.hum}%</Text>
      </View>
    );
  };

  const cfg = {
    backgroundColor: theme.cardBackground,
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(248,113,113,${opacity})`,
    labelColor: (opacity = 1) => theme.subtleText,
    propsForDots: { r: '4', stroke: '#fff', strokeWidth: 1 },
    propsForBackgroundLines: { strokeDasharray: '', stroke: theme.borderColor },
    style: { borderRadius: 12 },
  };
  
  const hasData = serie.labels.length > 0;

  const chartData = useMemo(() => {
    const labels = serie.labels;
    let visibleLabels = labels;

    if (labels.length > 7) {
        const maxVisibleLabels = 5;
        const step = Math.ceil(labels.length / maxVisibleLabels);
        visibleLabels = labels.map((label, index) => (index % step === 0 ? label : ''));
    }

    if (!hasData) {
      return {
        labels: [' ', ' ', ' '],
        datasets: [{ data: [0, 50, 100], color: () => 'transparent' }],
      };
    }
    
    return {
      labels: visibleLabels,
      datasets: [
        { data: serie.temps, color: () => '#f87171', strokeWidth: 2 },
        { data: serie.hums, color: () => '#60a5fa', strokeWidth: 2 },
      ],
      legend: [t('temperature'), t('humidity')],
    };
  }, [hasData, serie.labels, serie.temps, serie.hums, t]);

  return (
    <Card title={t('dataGraph')} iconName={ChartLine} theme={theme}>
      <View style={styles.rng}>
        {ranges.map(r => (
          <CustomButton
            key={r.value}
            title={r.label}
            onPress={() => onTimeRangeChange(r.value as Props['timeRange'])}
            variant={timeRange === r.value ? 'primary' : 'secondary'}
            theme={theme}
            style={{ flex: 1, marginHorizontal: 3 }}
          />
        ))}
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
            <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <LineChart
          data={chartData}
          width={width - 60}
          height={230}
          chartConfig={cfg}
          bezier
          withShadow={false}
          yAxisMin={yAxisMin}
          fromZero={false}
          onDataPointClick={
            hasData
              // ✨ Logique de bascule (toggle) restaurée pour une meilleure fiabilité
              ? ({ index, x, y }) => {
                  // Si l'utilisateur clique sur le même point, on cache l'info-bulle
                  if (point && point.index === index) {
                    setPoint(null);
                  } else {
                    // Sinon, on affiche l'info-bulle pour le nouveau point
                    setPoint({
                      index,
                      x,
                      y,
                      temp: serie.temps[index],
                      hum: serie.hums[index],
                      label: serie.labels[index],
                    });
                  }
                }
              : () => {}
          }
          decorator={hasData ? tooltip : () => null}
          yAxisSuffix=" "
          style={{ marginVertical: 8, borderRadius: 12 }}
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  rng: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  tt: { position: 'absolute', padding: 8, borderRadius: 6, elevation: 3, zIndex: 10 },
  ttTx: { fontSize: 11, lineHeight: 16 },
  loaderContainer: {
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
