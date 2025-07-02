// -----------------------------------------------------------------------------
// Card.js
// Reusable "card" container with an optional icon in the header.
// -----------------------------------------------------------------------------
// - Accepts:
//     – title     : string           | label shown in the card header
//     – iconName  : React component  | Lucide (or any) icon component to render
//     – children  : React.ReactNode  | nested content
//     – style     : ViewStyle        | additional container styles
//     – theme     : design-system palette 
// -----------------------------------------------------------------------------
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Card({ title, iconName: Icon, children, style, theme }) {
  return (
    <View 
      style={[styles.base, { backgroundColor: theme.cardBackground }, style]}
    >
      {/* ---------- Header row (icon + title) ---------- */}
      <View style={styles.header}>
        {Icon && 
          <Icon 
            color={theme.text} 
            size={22} 
            style={styles.icon} 
          />
        }
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>

      {/* ----------- Arbitrary nested content ----------- */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginRight: 10 },
  title: { fontSize: 18, fontWeight: '600' },
});
