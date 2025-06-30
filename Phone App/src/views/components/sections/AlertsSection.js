// ─────────────────────────────────────────────────────────────────────────────
// AlertsSection.js
// Card that lists up to three recent alerts and offers a link to settings.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, BellRing, Settings } from 'lucide-react-native';

import Card from '../common/Card';
import CustomButton from '../common/CustomButton';
import { useTranslation } from 'react-i18next';

export default function AlertsSection({
  alerts,                // array of {id, message, time, type}
  onOpenAlertSettings,   // callback -> open modal
  theme,                 // colour palette
}) {

  const { t } = useTranslation();

  return (
    <Card title={t('recentAlerts')} iconName={BellRing} theme={theme}>
      {/* Empty-state versus list of messages  */}
      {alerts.length === 0 ? (
        <Text style={{ color: theme.subtleText, textAlign: 'center', paddingVertical: 10 }}>
          {t('noRecentAlerts')}
        </Text>
      ) : (
        alerts.slice(0, 3).map(a => (
          <View
            key={a.id}
            style={[
              styles.it,
              {
                borderLeftColor: a.type === 'error' ? theme.danger : theme.primary,
                backgroundColor: theme.background,
              },
            ]}
          >
            <AlertTriangle
              size={20}
              color={a.type === 'error' ? theme.danger : theme.primary}
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.msg, { color: theme.text }]}>{a.message}</Text>
              <Text style={[styles.time, { color: theme.subtleText }]}>{a.time}</Text>
            </View>
          </View>
        ))
      )}

      {/* Link to the global alert-threshold configuration modal */}
      <CustomButton
        title={t('configureAlerts')}
        variant="secondary"
        iconName={Settings}
        onPress={onOpenAlertSettings}
        theme={theme}
        style={{ marginTop: 15 }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  it:   {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    borderLeftWidth: 4, 
    borderRadius: 4, 
    marginBottom: 8 
  },
  msg:  { 
    fontSize: 13, 
    fontWeight: '500' 
  },
  time: { 
    fontSize: 11, 
    marginTop: 2 
  },
});