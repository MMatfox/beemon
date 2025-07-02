// ─────────────────────────────────────────────────────────────────────────────
// ChartsSection.js
// Line-chart of temperature & humidity over a selectable time range.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import Card from '../common/Card';
import CustomButton from '../common/CustomButton';
import { generateChartDataForRange } from '../../utils/chartHelpers';

import { ChartLine } from 'lucide-react-native';

import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function ChartsSection({
  timeRange,              // '24h' | '7d' | '30d'
  onTimeRangeChange,      // setter passed from parent
  theme,
}) {
  const { t } = useTranslation();

  /* Time-range buttons */
  const ranges = [
    { label: `24${t('hour')}`, value: '24h' },
    { label: `7${t('day')}`,   value: '7d'  },
    { label: `30${t('day')}`,  value: '30d' },
  ];

  /* Chart-kit compatible data object */
  const [data, setData] = useState(generateChartDataForRange(timeRange, t));

  useEffect(() => {
    setData(generateChartDataForRange(timeRange, t));
  }, [timeRange, t]);

  /* Tooltip state for one selected data-point */
  const [point, setPoint] = useState(null);

  /* Regenerate fake data whenever the user switches range */
  useEffect(() => {
    setData(generateChartDataForRange(timeRange));
    setPoint(null); // hide tooltip
  }, [timeRange]);

  /* Chart-kit config | all colours pulled from theme */
  const cfg = {
    backgroundColor: theme.cardBackground,
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    decimalPlaces: 1,
    color: theme.chartColor,
    labelColor: theme.chartColor,
    propsForDots: { r: '4' },
    propsForBackgroundLines: { strokeDasharray: '', stroke: theme.borderColor },
    style: { borderRadius: 12 },
  };

  /* Custom tooltip overlay rendered via decorator() */
  const tooltip = () => {
    if (!point) return null;

    /* Positioning math: keep box on-screen */
    const w = 120,
      h = 60,
      area = width - 60;
    let tx = point.x - w / 2,
      ty = point.y - h - 10;
    if (tx < 0) tx = 5;
    if (tx + w > area) tx = area - w - 5;
    if (ty < 0) ty = point.y + 15;

    return (
      <View style={[styles.tt, { left: tx, top: ty, backgroundColor: theme.tooltipBackground }]}>
        {point.label && (
          <Text style={[styles.ttTx, { color: theme.tooltipText, fontWeight: 'bold' }]}>
            {point.label}
          </Text>
        )}
        <Text style={[styles.ttTx, { color: theme.tooltipText }]}>Temp: {point.temp}°C</Text>
        <Text style={[styles.ttTx, { color: theme.tooltipText }]}>Hum: {point.hum}%</Text>
      </View>
    );
  };

  /* When a dot is tapped, store its coordinates + value for tooltip */
  const onDot = ({ index, x, y }) => {
    setPoint({
      index,
      x,
      y,
      temp: data.datasets[0].data[index],
      hum: data.datasets[1].data[index],
      label: data.labels[index] || '',
    });
  };

  return (
    <Card title={t('dataGraph')} iconName={ChartLine} theme={theme}>
      {/* ---------- Range-selector buttons ---------- */}
      <View style={styles.rng}>
        {ranges.map(r => (
          <CustomButton
            key={r.value}
            title={r.label}
            onPress={() => onTimeRangeChange(r.value)}
            variant={timeRange === r.value ? 'primary' : 'secondary'}
            theme={theme}
            style={{ flex: 1, marginHorizontal: 3 }}
          />
        ))}
      </View>

      {/* ---------- Line chart ---------- */}
      <LineChart
        data={data}
        width={width - 60}
        height={230}
        chartConfig={cfg}
        bezier
        onDataPointClick={onDot}
        decorator={tooltip}
        yAxisSuffix=" "
        style={{ marginVertical: 8, borderRadius: 12 }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  rng: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 15 
  },
  tt:  { 
    position: 'absolute', 
    padding: 8, 
    borderRadius: 6, 
    elevation: 3, 
    zIndex: 10 
  },
  ttTx:{ 
    fontSize: 11, 
    lineHeight: 16 
  },
});